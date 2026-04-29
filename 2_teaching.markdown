---
layout: page
title: Teaching
permalink: /teaching/
---

<style>
  /* ── Year badge ── */
  .year-badge {
    display: inline-block;
    background: #333;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
    margin-right: 0.4rem;
  }

  .status-badge {
    display: inline-block;
    background: #e8e8e8;
    color: #333;
    font-size: 0.78rem;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  /* ── Session pills ── */
  .session-type {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    margin-right: 0.25rem;
  }
  .type-CM  { background: #fde68a; color: #78350f; }
  .type-TD  { background: #bfdbfe; color: #1e3a5f; }
  .type-EI  { background: #d1fae5; color: #064e3b; }
  .type-TP  { background: #fce7f3; color: #831843; }
</style>

{% assign teaching = site.data.teaching.teaching %}
{% assign equivalences = site.data.teaching.level_equivalences %}
{% assign coefficients = site.data.teaching.hetd_coefficients %}

<!-- RESSOURCES & LIENS -->
<section class="resources-section">
  <h2>Ressources</h2>
  <ul>
    {% for course in teaching %}
    {% if course.links %}
    <li>
      {{ course.course }} :<br>
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

<!-- TABLEAU RÉCAPITULATIF PAR COURS ET ANNÉE -->
<section class="history-section">
  <h2>Récapitulatif des enseignements</h2>
  <table class="teaching-table" id="teaching-table">
    <thead>
      <tr>
        <th>Cours</th>
        <th>Niveau<br>Établissement</th>
        <th>Année &amp; Statut</th>
        <th>Type</th>
        <th>Heures &amp; Effectifs</th>
        <th>HETD</th>
      </tr>
    </thead>
    <tbody>
      {% for course in teaching %}
        {% assign nb_rows = 0 %}
        {% for yr in course.years %}
          {% for session in yr.sessions %}
            {% assign nb_rows = nb_rows | plus: 1 %}
          {% endfor %}
        {% endfor %}
        {% assign first_course_row = true %}
        {% for yr in course.years %}
          {% assign nb_year_rows = yr.sessions | size %}
          {% assign first_year_row = true %}
          {% for session in yr.sessions %}
            {% assign coeff = 1.0 %}
            {% for c in coefficients %}
              {% if c.type == session.type %}
                {% assign coeff = c.coefficient %}
              {% endif %}
            {% endfor %}
            {% assign session_hetd = 0.0 %}
            {% for g in session.groups %}
              {% assign g_hetd = g.hours | times: coeff %}
              {% assign session_hetd = session_hetd | plus: g_hetd %}
            {% endfor %}
            {% assign nb = session.groups | size %}
            <tr{% if first_year_row %} data-year="{{ yr.year }}"{% endif %}>
              {% if first_course_row %}
              <td rowspan="{{ nb_rows }}">{{ course.course }}</td>
              <td rowspan="{{ nb_rows }}">{{ course.level }}<br><small>{{ course.university | default: "—" }}</small></td>
              {% assign first_course_row = false %}
              {% endif %}
              {% if first_year_row %}
              <td rowspan="{{ nb_year_rows }}"><span class="year-badge">{{ yr.year }}</span><br><span class="status-badge">{{ yr.status }}</span></td>
              {% assign first_year_row = false %}
              {% endif %}
              <td>
                <span class="session-type type-{{ session.type }}">{{ session.type }}</span>
              </td>
              <td>
                {% for g in session.groups %}
                  {{ g.hours }}h - {{ g.students }}<br>
                {% endfor %}
              </td>
              <td class="hetd-cell" data-year="{{ yr.year }}"><strong>{{ session_hetd | round: 1 }}</strong></td>
            </tr>
          {% endfor %}
        {% endfor %}
      {% endfor %}
    </tbody>
    <tfoot id="teaching-tfoot"></tfoot>
  </table>
</section>

<!-- CONTENU DES COURS -->
<section class="history-section">
  <h2>Contenu des cours</h2>
  <ul>
    {% for course in teaching %}
    <li>
      <strong>{{ course.course }}</strong> :<br>
      <span>{{ course.details }}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<!-- TABLEAU DES ÉQUIVALENCES DE NIVEAUX -->
<section>
  <h2>Équivalences de niveaux</h2>
  <table>
    <thead>
      <tr>
        <th>Licence-Master</th>
        {% for eq in equivalences %}
        <th>{{ eq.licence }}</th>
        {% endfor %}
      </tr>
    </thead>
    <tbody>
      {% assign systems = "" | split: "" %}
      {% for eq in equivalences %}
        {% for e in eq.equivalents %}
          {% unless systems contains e.system %}
            {% assign systems = systems | push: e.system %}
          {% endunless %}
        {% endfor %}
      {% endfor %}
      {% for sys in systems %}
      <tr>
        <td><strong>{{ sys }}</strong></td>
        {% for eq in equivalences %}
          {% assign found = "" %}
          {% for e in eq.equivalents %}
            {% if e.system == sys %}
              {% assign found = e.level %}
            {% endif %}
          {% endfor %}
          <td>{% if found != "" %}{{ found }}{% else %}—{% endif %}</td>
        {% endfor %}
      </tr>
      {% endfor %}
    </tbody>
  </table>
</section>

<!-- TABLEAU DES COEFFICIENTS HETD -->
<section class="equiv-section">
  <h2>Coefficients HETD</h2>
  <table class="equiv-table" style="width:auto; min-width:340px;">
    <thead>
      <tr>
        <th>Type</th>
        <th>Coefficient</th>
        <th>Équivalence</th>
      </tr>
    </thead>
    <tbody>
      {% for c in coefficients %}
      <tr>
        <td><span class="session-type type-{{ c.type }}">{{ c.type }}</span></td>
        <td>{{ c.coefficient }}</td>
        <td>{{ c.note }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</section>

<script>
(function() {
  const cells = document.querySelectorAll('.hetd-cell');
  const yearTotals = {};
  let grandTotal = 0;

  cells.forEach(cell => {
    const year = cell.dataset.year;
    const val = parseFloat(cell.textContent) || 0;
    yearTotals[year] = (yearTotals[year] || 0) + val;
    grandTotal += val;
  });

  const tfoot = document.getElementById('teaching-tfoot');

  Object.entries(yearTotals)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .forEach(([year, total]) => {
      tfoot.innerHTML += `
        <tr style="background:#f0f0f0;">
          <td colspan="5" style="text-align:right; font-style:italic;">Total ${year}</td>
          <td><strong>${total.toFixed(1)}</strong></td>
        </tr>`;
    });

  tfoot.innerHTML += `
    <tr style="background:#333; color:#fff;">
      <td colspan="5" style="text-align:right;">Total général</td>
      <td><strong>${grandTotal.toFixed(1)}</strong></td>
    </tr>`;
})();
</script>