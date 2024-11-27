---
layout: page
title: Education & Career
permalink: /education_career/
order: 1
---


{% assign education = site.data.education.education %}
<section>
    <ul>
        {% for graduation in education %}
        <li>
            <span class="degree">{{ graduation.degree }}</span><br>
            <span class="degreefr">{{ graduation.degreefr }}</span><br>
            <span class="time">{{ graduation.time }}</span> - <span class="university">{{ graduation.university }}</span>
            {% if graduation.details %}
            <div class="details">
                {{ graduation.details | markdownify }}
            </div>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
</section>