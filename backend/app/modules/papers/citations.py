"""Citation export in APA / MLA / BibTeX / RIS.

Currently pure string templating on the client (`CiteModal`); doing it server-side
makes it testable and lets us later stream a real `.bib` file.
"""

from __future__ import annotations

from app.models.paper import Paper

INITIALS = lambda name: " ".join(  # noqa: E731
    (p[0] + ".") if len(p) > 1 and p[1:].isalpha() else p for p in name.split()
)


def _apa_authors(authors: list[str]) -> str:
    if not authors:
        return ""
    formatted = [INITIALS(a) for a in authors]
    if len(formatted) == 1:
        return formatted[0]
    if len(formatted) == 2:
        return f"{formatted[0]}, & {formatted[1]}"
    return ", ".join(formatted[:-1]) + f", & {formatted[-1]}"


def _last_names(authors: list[str]) -> list[str]:
    out = []
    for a in authors:
        parts = a.replace("Prof. ", "").replace("Dr. ", "").split()
        out.append(parts[-1] if parts else a)
    return out


def format_citation(paper: Paper, fmt: str) -> str:
    authors = paper.authors or []
    title = paper.title.rstrip(".")
    year = paper.year
    venue = paper.venue
    doi = paper.doi

    if fmt == "APA":
        author_str = _apa_authors(authors)
        core = f"{author_str} ({year}). {title}."
        if venue:
            core += f" *{venue}*"
        if doi:
            core += f". https://doi.org/{doi}"
        return core

    if fmt == "MLA":
        last = _last_names(authors)
        if not last:
            author_str = ""
        elif len(last) == 1:
            author_str = last[0]
        elif len(last) == 2:
            author_str = f"{last[0]}, and {last[1]}"
        else:
            author_str = f"{last[0]}, et al"
        head = f"{author_str}. “{title}.”".lstrip(". ")
        tail = f" {venue}, {year}."
        if doi:
            tail += f" https://doi.org/{doi}."
        return (head + tail).strip()

    if fmt == "BibTeX":
        last = _last_names(authors)
        first_last = last[0].lower().replace(" ", "") if last else "anon"
        first_title = title.split()[0].lower()[:6] if title.split() else "paper"
        key = f"{first_last}{year}{first_title}"
        lines = [
            f"@article{{{key},",
            f"  title   = {{{title}}},",
            f"  author  = {{{' and '.join(authors)}}},",
            f"  journal = {{{venue}}},",
            f"  year    = {{{year}}},",
        ]
        if doi:
            lines.append(f"  doi     = {{{doi}}},")
        lines.append("}")
        return "\n".join(lines)

    if fmt == "RIS":
        lines = ["TY  - JOUR", f"TI  - {title}"]
        for a in authors:
            last = a.replace("Prof. ", "").replace("Dr. ", "").split()
            if len(last) >= 2:
                lines.append(f"AU  - {last[-1]}, {' '.join(last[:-1])}")
            else:
                lines.append(f"AU  - {a}")
        if venue:
            lines.append(f"JO  - {venue}")
        lines.append(f"PY  - {year}")
        if doi:
            lines.append(f"DO  - {doi}")
        lines.append("ER  - ")
        return "\n".join(lines)

    raise ValueError(f"Unsupported citation format: {fmt}")
