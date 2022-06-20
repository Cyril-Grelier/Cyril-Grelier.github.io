---
layout: page
title: Projects
permalink: /projects/
---

{% assign projects = site.data.projects.projects %}
<section>
    <h2>{{ projects.title }}</h2>
    {% if projects.intro %}
    {{ projects.intro }}
    {% endif %}
    <ul>
        {% for project in projects.assignments %}
        <li>
            <span>
                {% if project.link %}
                <a href="{{ project.link }}" target="_blank">{{ project.title }}</a>
                {% else %}
                {{ project.title }}
                {% endif %}
            </span>
            <br>
            <span class="time">{{ project.time }}</span> - <span >{{ project.place }}</span>
            <br>
            <span>{{ project.description }}</span>
        </li>
        {% endfor %}
    </ul>
</section>
