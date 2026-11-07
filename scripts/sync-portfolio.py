#!/usr/bin/env python3
"""Import Lulamile's public portfolio projects and AI design prompts.

Only the six public desktop projects and the prompt library are read. No
credential material, locked studies or training documents are imported.
Paid prompt bodies are never copied: only their public sales links are kept.

    python3 scripts/sync-portfolio.py
    python3 scripts/sync-portfolio.py --source-dir /path/to/portfolio-checkout

Uses Python's standard library. Downloads are restricted to the owner's public
GitHub repository; runtime pages use the resulting local data and images.
"""
from __future__ import annotations

import argparse
import json
import re
import tempfile
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = "LulamileMkhungela/portfolio.github.io"
BASE = f"https://api.github.com/repos/{REPO}/contents/"
ORIGIN = f"https://lulamilemkhungela.github.io/portfolio.github.io/"
PROJECT_IDS = [
    "employee-engagement-app-redesign", "foodiezone-pwa",
    "designops-design-system", "forma-design-system", "prodops",
    "toyota-mobility-brand",
]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Node:
    def __init__(self, tag="", attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []

    def find_all(self, tag=None, cls=None):
        found = []
        for child in self.children:
            if isinstance(child, Node):
                classes = child.attrs.get("class", "").split()
                if (tag is None or child.tag == tag) and (cls is None or cls in classes):
                    found.append(child)
                found.extend(child.find_all(tag, cls))
        return found

    def text(self):
        parts = []
        for child in self.children:
            if isinstance(child, str):
                parts.append(child)
            else:
                if child.tag in {"p", "li", "h1", "h2", "h3", "figcaption", "small", "div"}:
                    parts.append("\n")
                elif child.tag in {"b", "strong", "em", "span", "a"}:
                    parts.append(" ")
                parts.append(child.text())
                if child.tag in {"p", "li", "h1", "h2", "h3", "figcaption", "small", "div"}:
                    parts.append("\n")
                else:
                    parts.append(" ")
        return re.sub(r"[ \t]+", " ", "".join(parts)).strip()

    def paragraphs(self):
        return clean_lines(self.text())


class Tree(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def clean_lines(value):
    return [re.sub(r"\s+", " ", line).strip() for line in value.splitlines() if line.strip()]


def fetch(path, dest):
    if dest.exists():
        return dest.read_bytes()
    request = urllib.request.Request(
        BASE + path + "?ref=main",
        headers={"Accept": "application/vnd.github.raw+json", "User-Agent": "Lulamile-portfolio-import"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return data


def local_image(src, folder, cache):
    if not src or src.startswith(("data:", "http:", "https:")):
        return None
    path = re.sub(r"^\.\./", "", src)
    # Never follow a path into training documents or non-image assets.
    if "certificate" in path.lower() or not path.startswith(("images/work/", "public/images/promptsite-covers/")):
        return None
    name = Path(path).name
    fetch(path, cache / path)
    target = Path(folder) / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes((cache / path).read_bytes())
    return name


def metadata(tree):
    result = {}
    for item in tree.root.find_all("div", "pk-meta__item"):
        spans = item.find_all("span")
        if len(spans) >= 2:
            result[spans[0].text().lower()] = spans[1].text()
    return result


def images(node, folder, cache):
    result = []
    for image in node.find_all("img"):
        name = local_image(image.attrs.get("src", ""), folder, cache)
        if name:
            caption = image.attrs.get("alt", "")
            # The source uses figure/figcaption consistently for its galleries.
            figure = next((n for n in node.find_all("figure") if image in n.find_all("img")), None)
            if figure and figure.find_all("figcaption"):
                caption = figure.find_all("figcaption")[0].text()
            result.append({"src": name, "alt": image.attrs.get("alt", ""), "caption": caption})
    return result


def cards(node):
    result = []
    for card in node.find_all("article", "pk-card"):
        headings = card.find_all("h3")
        labels = card.find_all("span", "pk-card__index")
        result.append({
            "title": headings[0].text() if headings else "",
            "label": labels[0].text() if labels else "",
            "body": [p.text() for p in card.find_all("p") if "pk-card__tradeoff" not in p.attrs.get("class", "")],
            "items": [li.text() for li in card.find_all("li")],
            "tradeoff": " ".join(p.text() for p in card.find_all("p", "pk-card__tradeoff")),
        })
    return result


def results(node):
    found = []
    for cls in ("pk-result", "pk-outcome"):
        for item in node.find_all(cls=cls):
            strong = item.find_all("strong")
            text_nodes = item.find_all(cls="pk-outcome__text")
            small = item.find_all("small")
            title = strong[0].text() if strong else (text_nodes[0].text().split("\n")[0] if text_nodes else "")
            body = [p.text() for p in item.find_all("p")]
            if small:
                for note in small:
                    # The source sometimes puts an inline “Impact” label inside the note.
                    parts = re.split(r"\s+(Impact|Outcome|Result)\s+", note.text())
                    body.append(parts[0])
                    for i in range(1, len(parts), 2):
                        body.append(f"{parts[i]}: {parts[i + 1]}")
            if title or body:
                found.append({"title": title, "body": body})
    return found


def parse_project(project_id, source, cache):
    tree = Tree(source)
    meta = metadata(tree)
    hero = tree.root.find_all(cls="pk-hero")[0]
    title_nodes = hero.find_all("h1")
    title = title_nodes[0].text() if title_nodes else project_id
    description = tree.root.find_all("p", "pk-lead")
    meta_description = next((n.attrs.get("content", "") for n in tree.root.find_all("meta") if n.attrs.get("name") == "description"), "")
    live = next((a.attrs.get("href") for a in hero.find_all("a", "pk-livecue") if a.attrs.get("href", "").startswith("https://")), "")
    cover_nodes = hero.find_all("img")
    cover = local_image(cover_nodes[0].attrs.get("src"), ROOT / "assets/img/projects", cache) if cover_nodes else None
    sections = []
    seen_images = set()
    names = {
        "overview": "Overview", "problem": "The challenge", "role": "My role",
        "goals": "The goals", "strategy": "The approach", "research": "Research",
        "personas": "Who it is for", "process": "The process", "decisions": "Key decisions",
        "impact": "Impact", "checks": "Evidence and boundaries", "outcomes": "Outcomes",
        "conclusion": "What I took forward", "tradeoffs": "Current limitations",
        "vodacom-internal": "Related platform work", "work": "Selected screens", "live": "The live product",
    }
    for section in tree.root.find_all("section"):
        sid = section.attrs.get("id", "")
        if sid in {"lead", "context"} or not sid:
            continue
        headings = section.find_all("h2")
        heading = headings[0].text() if headings else names.get(sid, sid.replace("-", " ").title())
        eyebrows = section.find_all(cls="pk-eyebrow")
        kicker = eyebrows[0].text() if eyebrows else names.get(sid, "Project detail")
        entry = {"id": sid, "kicker": kicker, "title": heading, "paragraphs": [], "cards": cards(section), "steps": [], "results": results(section), "images": []}
        if sid in {"overview", "role", "research", "checks", "conclusion", "impact"}:
            for copy in section.find_all(cls="pk-copy"):
                entry["paragraphs"].extend(copy.paragraphs())
            for lead in section.find_all(cls="pk-lead"):
                entry["paragraphs"].extend(lead.paragraphs())
            statements = section.find_all(cls="pk-overview__statement")
            if statements:
                entry["paragraphs"][:0] = statements[0].paragraphs()
        if sid == "checks":
            entry["paragraphs"] = list(dict.fromkeys(entry["paragraphs"]))
        for step in section.find_all("article", "pk-step"):
            hs = step.find_all("h3")
            entry["steps"].append({"title": hs[0].text() if hs else "Step", "body": [p.text() for p in step.find_all("p")]})
        for image in images(section, ROOT / "assets/img/projects", cache):
            if image["src"] not in seen_images and image["src"] != cover:
                entry["images"].append(image)
                seen_images.add(image["src"])
        if any(entry[k] for k in ("paragraphs", "cards", "steps", "results", "images")):
            sections.append(entry)
    # Stable editorial facts from the public source; no invented engagement metrics.
    details = {
        "employee-engagement-app-redesign": ("Vodacom Engage", "Employee app", "Product", "Vodacom HRIT · Midrand", "Johannesburg, South Africa", "Published", "engage-cover.webp", ["Enterprise", "Mobile app", "UX research"]),
        "foodiezone-pwa": ("FoodieZone", "Ordering PWA", "Impact", "FoodieZone · Pimville, Soweto", "Pimville, Soweto", "Live", "foodiezone-cover.webp", ["Small business", "PWA", "UI development"]),
        "designops-design-system": ("DesignOps", "Tokens & linter", "Product", "Self-initiated · Lulamile Mkhungela", "Built in South Africa", "Live preview", "design-ops-cover.webp", ["Design systems", "Figma", "React", "Angular"]),
        "forma-design-system": ("Forma Design System", "A shared design language", "Product", "Self-initiated · Lulamile Mkhungela", "Built in South Africa", "In progress", "forma-cover.svg", ["Design systems", "Figma plugin", "React", "Angular"]),
        "prodops": ("ProdOps", "From product thinking to a build", "Product", "Self-initiated · Lulamile Mkhungela", "Built in South Africa", "In progress", None, ["Product planning", "Agent workflows", "Handoff"]),
        "toyota-mobility-brand": ("Toyota Mobility Brand", "Brand, system & connected apps", "Brand", "Toyota South Africa · via iOCO", "South Africa", "Published", "brand-strategy-cover.webp", ["Brand strategy", "Design systems", "Mobility"]),
    }
    name, subtitle, category, client, location, status, fallback_cover, tags = details[project_id]
    cover = cover or fallback_cover
    # A fallback cover can also appear as the first gallery image; show it once.
    for section in sections:
        section["images"] = [image for image in section["images"] if image["src"] != cover]
    sections = [section for section in sections if any(section[k] for k in ("paragraphs", "cards", "steps", "results", "images"))]
    return {
        "id": project_id, "title": name, "subtitle": subtitle, "category": category,
        "tags": tags, "client": client, "location": location, "status": status,
        "role": meta.get("role", "Product designer and developer"),
        "year": meta.get("year", meta.get("status", "Ongoing")),
        "description": meta_description or (description[0].text() if description else subtitle),
        "summary": description[0].text() if description else meta_description,
        "cover": cover or fallback_cover,
        "sourceUrl": ORIGIN + (f"portfolio/{project_id}.html" if project_id != "prodops" else ""),
        "url": "https://lulamilemkhungela.github.io/ProdOps/" if project_id == "prodops" else f"case-study.html?id={project_id}",
        "liveUrl": live, "sections": sections,
    }


class PromptCards(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.cards = []
        self.current = None
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "article" and "ps-card" in a.get("class", "").split():
            self.current = a
            self.depth = 1
        elif self.current:
            if tag == "article":
                self.depth += 1
            if tag == "img":
                self.current["image"] = a.get("src", "")
                self.current["alt"] = a.get("alt", "")

    def handle_endtag(self, tag):
        if self.current and tag == "article":
            self.depth -= 1
            if self.depth == 0:
                self.cards.append(self.current)
                self.current = None


def parse_prompts(source, cache):
    parser = PromptCards()
    parser.feed(source)
    categories = {"mobile": "Mobile apps", "appstore": "Mobile apps", "ecom": "Web & commerce", "landing": "Web & commerce", "hero": "Web & commerce", "portfolio": "Portfolio"}
    prompts = []
    for index, card in enumerate(parser.cards):
        access = card.get("data-price")
        if access not in {"free", "paid"}:
            continue  # Do not advertise unfinished resources as available.
        title = card.get("data-title", "Design prompt").replace("wth animations", "with animations").replace("Edtech Saas", "Edtech SaaS").replace(" +Figma", " + Figma")
        prompt = card.get("data-prompt", "") if access == "free" else ""
        if access == "free" and not prompt:
            raise ValueError(f"Free prompt has no public text: {title}")
        subtitle = card.get("data-subtitle", "Prompt")
        price = re.search(r"R\d+(?:[,.]\d+)?", subtitle)
        prompts.append({
            "id": re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-"),
            "title": title, "category": categories.get(card.get("data-cat", "").split()[0], "Design"),
            "access": access, "format": re.sub(r"^R\d+\s*·\s*", "", subtitle),
            "price": price.group(0) if price else "", "cover": local_image(card.get("image"), ROOT / "assets/img/prompts", cache),
            "alt": card.get("alt", title + " preview"), "prompt": prompt,
            "url": card.get("data-buy", "https://selar.com/m/le-loux") if access == "paid" else "",
            "author": "Lulamile Mkhungela", "sourceUrl": ORIGIN + "portfolio/lula-design-library.html",
        })
    return prompts


def write_script(path, variable, data, note):
    path.write_text(f"/** {note} */\nwindow.{variable} = {json.dumps(data, ensure_ascii=False, indent=2)};\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, help="Existing checkout of the public portfolio, instead of downloading")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="lulamile-public-") as temp:
        cache = args.source_dir or Path(temp)
        def read(path):
            return fetch(path, cache / path).decode("utf-8")
        index = read("js/projects.js")
        projects = []
        for project_id in PROJECT_IDS:
            match = re.search(r'id:\s*"' + re.escape(project_id) + r'"[\s\S]{0,1200}?category:\s*"([^"]+)"', index)
            if not match:
                raise ValueError(f"Project missing from the public desktop: {project_id}")
            if project_id == "prodops":
                # This public folder is a shortcut, not a case study. Keep its real status.
                project = parse_project_stub()
            else:
                project = parse_project(project_id, read(f"portfolio/{project_id}.html"), cache)
            if project["category"] != match.group(1):
                raise ValueError(f"Category changed upstream for {project_id}; review before importing")
            projects.append(project)
        prompts = parse_prompts(read("portfolio/lula-design-library.html"), cache)
        write_script(ROOT / "assets/js/projects.data.js", "PROJECTS", projects, "Public project content from Lulamile Mkhungela's portfolio. Refresh with scripts/sync-portfolio.py; editorial summaries live in this file.")
        write_script(ROOT / "assets/js/prompts.data.js", "PROMPTS", prompts, "Lulamile Mkhungela's AI design prompts. Free text is public; paid bodies are intentionally excluded. Refresh with scripts/sync-portfolio.py.")
        manifest = {"source": ORIGIN, "repository": REPO, "projects": [p["id"] for p in projects], "promptCount": len(prompts), "policy": "Public desktop projects and public prompt metadata only. No training documents, locked studies or paid prompt bodies."}
        (ROOT / "reference/portfolio-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"Imported {len(projects)} projects and {len(prompts)} available prompts ({sum(p['access'] == 'free' for p in prompts)} free).")


def parse_project_stub():
    return {
        "id": "prodops", "title": "ProdOps", "subtitle": "From product thinking to a build", "category": "Product",
        "tags": ["Product planning", "Agent workflows", "Handoff"], "client": "Self-initiated · Lulamile Mkhungela",
        "location": "Built in South Africa", "status": "In progress", "role": "Product designer and developer", "year": "Ongoing",
        "description": "My in-progress product-planning workspace: shape the product, design the experience and export a handoff a coding agent can build from.",
        "cover": None, "sourceUrl": ORIGIN, "url": "https://lulamilemkhungela.github.io/ProdOps/", "liveUrl": "https://lulamilemkhungela.github.io/ProdOps/", "sections": [],
    }


if __name__ == "__main__":
    main()
