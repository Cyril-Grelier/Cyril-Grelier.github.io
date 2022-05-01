---
layout: page
title: Publications
permalink: /publications/
---

{% assign publications = site.data.publications.publications %}
<section>
    {% for publication in publications.kind %}
    <h3>{{publication.title}}</h3>
    {% if publication.intro %}
    <div>
        {{ publication.intro | markdownify }}
    </div>
    {% endif %}
    {% for paper in publication.papers %}
    <ul>
        {% if paper.link %}
        <li><a href="{{ paper.link }}">{{ paper.title }}</a></li>
        {% else %}
        <li>{{ paper.title }}</li>
        {% endif %}
        <div>{{ paper.authors }}</div>
        <div>{{ paper.conference }}</div>
        {% if paper.code %}
        <a href="{{ paper.code }}">code</a>
        {% endif %}
        {% if paper.preprint %}
        <a href="{{ paper.preprint }}">preprint</a>
        {% endif %}
        {% if paper.presentation %}
        <a href="{{ paper.presentation }}">presentation</a>
        {% endif %}
    </ul>
    {% endfor %}
    {% endfor %}
</section>