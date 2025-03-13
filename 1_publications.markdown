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
        <ol reversed>
        {% for paper in publication.papers %}
            {% if paper.id %}
            <li id="{{ paper.id }}">
            {% else %}
            <li>
            {% endif %}
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
                {% if paper.code or paper.preprint or paper.presentation or paper.demo or paper.poster or paper.hal or paper.openaccess %}
                <ul class="liste-inline">
                    {% if paper.openaccess %}
                    <li><a href="{{ paper.openaccess }}" target="_blank"> Open Access
                        <!-- <svg class="svg-icon"><use xlink:href="{{ '/assets/minima-social-icons.svg#hal' | relative_url }}"></use></svg> -->
                    </a></li>
                    {% endif %}
                    {% if paper.hal %}
                    <li><a href="{{ paper.hal }}" target="_blank"> HAL
                        <!-- <svg class="svg-icon"><use xlink:href="{{ '/assets/minima-social-icons.svg#hal' | relative_url }}"></use></svg> -->
                    </a></li>
                    {% endif %}
                    {% if paper.preprint %}
                    <li><a href="{{ paper.preprint }}" target="_blank">preprint</a></li>
                    {% endif %}
                    {% if paper.doi %}
                    <li><a href="{{ paper.doi }}" target="_blank">doi</a></li>
                    {% endif %}
                    {% if paper.scimago %}
                    <li><a href="{{ paper.scimago }}" target="_blank">Scimago : {{ paper.scimago_rank }}</a></li>
                    {% endif %}
                    {% if paper.core %}
                    <li><a href="{{ paper.core }}" target="_blank">CORE : {{ paper.core_rank }}</a></li>
                    {% endif %}
                    {% if paper.presentation %}
                    <li><a href="{{ paper.presentation }}" target="_blank">slides</a></li>
                    {% endif %}
                    {% if paper.poster %}
                    <li><a href="{{ paper.poster }}" target="_blank">poster</a></li>
                    {% endif %}
                    {% if paper.demo %}
                    <li><a href="{{ paper.demo }}" target="_blank">demo</a></li>
                    {% endif %}
                    {% if paper.code %}
                    <li><a href="{{ paper.code }}" target="_blank">code</a></li>
                    {% endif %}
                </ul>
                {% endif %}
            </li>
        {% endfor %}
        </ol>
    {% endfor %}
</section>
