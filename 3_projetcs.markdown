---
layout: page
title: Projects
permalink: /projects/
---

{% assign projects = site.data.projects.projects %}
<section>
    <h2>{{ projects.title }}</h2>
    {% if projects.intro %}
    <div><p>{{ projects.intro }}</p></div>
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
            <div>
                <span class="time">{{ project.time }}</span> - <span >{{ project.place }}</span>
            </div>
            <div>
                <span>{{ project.description }}</span>
            </div>
        </li>
        {% endfor %}
    </ul>
</section>
