---
layout: page
title: Posts
permalink: /posts/
order: 0
---

<!-- <ul class="post-list">
    {%- for post in site.posts -%}
    <li>
        {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        <h3>
            <a class="post-link" href="{{ post.url | relative_url }}">
                {{ post.title | escape }}
            </a>
        </h3>
        {%- if site.show_excerpts -%}
        {{ post.excerpt }}
        {%- endif -%}
    </li>
    {%- endfor -%}
</ul> -->

{% for post in site.posts %}
{%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}

- <span class="post-meta">{{ post.date | date: date_format }}</span><br>[{{ post.title }}]({{ post.url }})<br>{{ post.excerpt | strip_html }}
  **Categories:** {% for category in post.categories %}{{ category }}{% unless forloop.last %}, {% endunless %}{% endfor %}

{% endfor %}
