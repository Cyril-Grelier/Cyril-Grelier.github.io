---
layout: page
title: Education & Career
permalink: /education_career/
order: 1
---


{% assign education = site.data.education.education %}

<button id="lang-toggle" class="toggle-btn">FR</button>

<div class="hidden" id="fr-section">
  <section>
    <ul>
    {% for graduation in education %}
        <li>
          <span>{{ graduation.degreefr }}</span><br>
          <span class="time">{{ graduation.time }}</span> - <span class="university">{{ graduation.university }}</span><br>
          <span>{{ graduation.detailsfr | markdownify }}</span>
        </li>
      {% endfor %}
    </ul>
  </section>
</div>

<div id="en-section">
  <section>
    <ul>
      {% for graduation in education %}
        <li>
          <span>{{ graduation.degree }}</span><br>
          <span class="time">{{ graduation.time }}</span> - <span class="university">{{ graduation.university }}</span><br>
          <span>{{ graduation.details | markdownify }}</span>
        </li>
      {% endfor %}
    </ul>
  </section>
</div>

<script>
  const toggleBtn = document.getElementById('lang-toggle');
  const frSection = document.getElementById('fr-section');
  const enSection = document.getElementById('en-section');
  const title = document.querySelector('h1');

  let currentLang = 'en';

  toggleBtn.addEventListener('click', () => {
    if (currentLang === 'fr') {
      frSection.classList.add('hidden');
      enSection.classList.remove('hidden');
      toggleBtn.textContent = 'FR';
      title.textContent = 'Education & Career';
      currentLang = 'en';

    } else {
      enSection.classList.add('hidden');
      frSection.classList.remove('hidden');
      toggleBtn.textContent = 'EN';
      title.textContent = 'Éducation & Carrière';
      currentLang = 'fr';
    }
  });
</script>
