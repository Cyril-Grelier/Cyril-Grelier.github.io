---
layout: page
title: Teaching
permalink: /teaching/
---

{% assign teaching = site.data.teaching.teaching %}

<section>
    <ul>
        {% for course in teaching %}
        <li>
            {{ course.course }}<br>
            <span class="university">{{ course.university }}</span>
            <br>
            <span class="time">{{ course.time }}</span>
            {% if course.details %}
            <br>
            <!-- {{ course.details | markdownify }} -->
            <span>{{ course.details }}</span>
            {% endif %}
            {% if course.links %}
            <br>
            Links :
            <ul>
                {% for link in course.links %}
                <li><a href="{{ link.link }}" target="_blank">{{ link.title }}</a></li>
                {% endfor %}
            </ul>
            {% endif %}
        </li>
        <br>
        {% endfor %}
    </ul>
</section>
