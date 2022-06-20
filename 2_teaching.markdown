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
            {{ course.details | markdownify }}
            {% endif %}
        </li>
        {% endfor %}
    </ul>
</section>