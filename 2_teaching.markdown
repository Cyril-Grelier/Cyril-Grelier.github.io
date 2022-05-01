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
        <div>
            <div>{{ course.course }}</div>
            <div>
                <span class="university">{{ course.university }}</span> - <span class="time">{{ course.time }}</span>
            </div>
        </div>
        {% if course.details %}
        <div>
            {{ course.details | markdownify }}
        </div>
        {% endif %}
    </li>
    {% endfor %}
    </ul>
</section>