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
        <ul>
        {% for paper in publication.papers %}
            <li>
            {% if paper.link %}
                <a href="{{ paper.link }}" target="_blank">{{ paper.title }}</a>
            {% else %}
                {{ paper.title }}
            {% endif %}
            <br>
            {{ paper.authors }}
            <br>
            {{ paper.conference }}
            <br>
            {% if paper.code %}
                <a href="{{ paper.code }}" target="_blank">code</a>
            {% endif %}
            {% if paper.preprint %}
                <a href="{{ paper.preprint }}" target="_blank">preprint</a>
            {% endif %}
            {% if paper.presentation %}
                <a href="{{ paper.presentation }}" target="_blank">slides</a>
            {% endif %}
            </li>
        {% endfor %}
        </ul>
    {% endfor %}
</section>
