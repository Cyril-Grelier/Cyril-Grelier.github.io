<!-- ---
layout: page
title: Projects
permalink: /projects/
--- -->

{% assign projects = site.data.projects.projects %}

<section>
    {% for project in projects %}
    <h2>{{ project.title }}</h2>
    {% if project.intro %}
    {{ project.intro }}
    {% endif %}
    <ul>
        {% for assignment in project.assignments %}
        <li>
            <span>
                {% if assignment.link %}
                <a href="{{ assignment.link }}" target="_blank">{{ assignment.title }}</a>
                {% else %}
                {{ assignment.title }}
                {% endif %}
            </span>
            <br>
            <span class="time">{{ assignment.time }}</span> - <span >{{ assignment.place }}</span>
            <br>
            <span>{{ assignment.description }}</span>
        </li>
        {% endfor %}
    </ul>
    {% endfor %}
</section>
