---
layout: page
title: Teaching
permalink: /teaching/
---

{% assign teaching = site.data.teaching.teaching %}

<section>
  Ressources :
  <ul>
    {% for course in teaching %}
    {% if course.links %}
    <li>
      {{ course.course }}<br>
      <ul>
        {% for link in course.links %}
        <li><a href="{{ link.link }}" target="_blank">{{ link.title }}</a></li>
        {% endfor %}
      </ul>
    </li>
    <br>
    {% endif %}
    {% endfor %}
  </ul>
</section>

<section>

<p>Voici un tableau récapitulatif des cours auquels j'ai participé :</p>

<table style="text-align:center">
  <thead>
    <tr>
      <th>Statut</th>
      <th>Année</th>
      <th>Établissement</th>
      <th>Public</th>
      <th>Niveau</th>
      <th>Matière</th>
      <th>Durée</th>
      <th>Effectifs</th>
      <th>Nature</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vacataire</td>
      <td>2024-2025</td>
      <td>Mines<br>Nancy</td>
      <td>Ingénieur<br>Informatique</td>
      <td>Équivalent<br>L3</td>
      <td>Recherche<br>Opérationnelle</td>
      <td>19h</td>
      <td>17</td>
      <td>TD</td>
    </tr>
    <tr>
      <td>Vacataire</td>
      <td>2024-2025</td>
      <td>Polytech<br>Nancy</td>
      <td>Ingénieur<br>Informatique</td>
      <td>Équivalent<br>L3</td>
      <td>Bases de <br>Données</td>
      <td>21h</td>
      <td>29</td>
      <td>CM-TD</td>
    </tr>
    <tr>
      <td>DCACE<br>Vacataire</td>
      <td>2022-2023<br>2023-2024</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L3</td>
      <td>Algorithmique<br>des Graphes</td>
      <td>8h<br>2x8h</td>
      <td>15-20</td>
      <td>TP</td>
    </tr>
    <tr>
      <td>DCACE</td>
      <td>2021-2022<br>2022-2023</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L1</td>
      <td>Python</td>
      <td>16h<br>16h</td>
      <td>15-20</td>
      <td>TP-Projet</td>
    </tr>
    <tr>
      <td>DCACE</td>
      <td>2020-2021<br>2021-2022<br>2022-2023</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L1</td>
      <td>Linux</td>
      <td>12h<br>8h<br>8h</td>
      <td>15-20</td>
      <td>TP</td>
    </tr>
    <tr>
      <td>DCACE</td>
      <td>2020-2021<br>2021-2022<br>2022-2023</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L1</td>
      <td>Développement<br>Web</td>
      <td>12h<br>20h<br>20h</td>
      <td>15-20</td>
      <td>TP</td>
    </tr>
    <tr>
      <td>DCACE</td>
      <td>2020-2021<br>2021-2022</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L1</td>
      <td>Culture<br>Numérique</td>
      <td>16h<br>8h</td>
      <td>15-20</td>
      <td>TP</td>
    </tr>
    <tr>
      <td>DCACE</td>
      <td>2020-2021<br>2021-2022<br>2022-2023</td>
      <td>UA</td>
      <td>Licence<br>Informatique</td>
      <td>L1</td>
      <td>Algorithmique</td>
      <td>24h<br>12h<br>12h</td>
      <td>15-20</td>
      <td>TP</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th>248h</th>
      <th></th>
      <th></th>
    </tr>
  </tfoot>
</table>

<p>ainsi que le contenu de chaque cours :</p>


<ul>
  {% for course in teaching %}
  <li>
    <strong>{{ course.course }}</strong> :<br>
    <!-- {{ course.details | markdownify }} -->
    <span>{{ course.details }}</span>
  </li>
  {% endfor %}
</ul>
</section>


<!--
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
-->