---
layout: page
title: Education
permalink: /education/
order: 1
---


{% assign education = site.data.education.education %}
<section>
    <ul>
        {% for graduation in education %}
        <li>
            <div>
                <div>
                    <span class="degree">{{ graduation.degree }}</span>
                    {% if graduation.degreefr %}
                    <br>
                    <span class="degreefr">{{ graduation.degreefr }}</span>
                    {% endif %}
                </div>
                <div>
                    <span class="time">{{ graduation.time }}</span> - 
                    <span class="university">{{ graduation.university }}</span>
                </div>
            </div>
            {% if graduation.details %}
            <div class="details">
                {{ graduation.details | markdownify }}
            </div>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
</section>