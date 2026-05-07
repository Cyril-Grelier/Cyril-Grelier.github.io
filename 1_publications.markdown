---
layout: page
title: Publications
permalink: /publications/
---

{% assign publications = site.data.publications.publications %}

<button id="format-toggle" class="toggle-btn">HAL</button>

<div class="hidden" id="hal-section">
  <section>
    <a href="https://cv.hal.science/cyril-grelier" target="_blank">CV HAL</a><br><br>
    <iframe src="https://haltools.archives-ouvertes.fr/Public/afficheRequetePubli.php?idHal=cyril-grelier&CB_auteur=oui&CB_titre=oui&CB_article=oui&CB_DOI=oui&CB_resume=oui&CB_typdoc=oui&langue=Anglais&tri_exp=annee_publi&tri_exp2=typdoc&tri_exp3=date_publi&ordre_aff=TA&Fen=Aff&css=../css/VisuRubriqueEncadre.css"
        width="100%"
        height="3000px"
        frameborder="0">
    </iframe>
  </section>
</div>

<div id="list-section">
    <section>
        {% for publication in publications.kind %}
            <h3>{{publication.title}}</h3>
            {% if publication.intro %}
            <div>
                {{ publication.intro | markdownify }}
            </div>
            {% endif %}
            <ol reversed>
            {% for paper in publication.papers %}
                {% if paper.id %}
                <li id="{{ paper.id }}">
                {% else %}
                <li>
                {% endif %}
                    {% if paper.link %}
                    <a href="{{ paper.link }}" target="_blank">{{ paper.title }}</a>
                    {% else %}
                    {{ paper.title }}
                    {% endif %}
                    <br>
                    {{ paper.authors }}
                    <br>
                    {{ paper.conference }}
                    <br>
                    {% if paper.code or paper.preprint or paper.presentation or paper.demo or paper.poster or paper.hal or paper.openaccess %}
                    <ul class="liste-inline">
                        {% if paper.openaccess %}
                        <li><a href="{{ paper.openaccess }}" target="_blank"><i class="ai ai-open-access"></i> Open Access</a></li>
                        {% endif %}
                        {% if paper.hal %}
                        <li><a href="{{ paper.hal }}" target="_blank"><i class="ai ai-hal"></i> HAL</a></li>
                        {% endif %}
                        {% if paper.preprint %}
                        <li><a href="{{ paper.preprint }}" target="_blank"><i class="ai ai-arxiv"></i> preprint</a></li>
                        {% endif %}
                        {% if paper.doi %}
                        <li><a href="{{ paper.doi }}" target="_blank"><i class="ai ai-doi"></i> doi</a></li>
                        {% endif %}
                        {% if paper.scimago %}
                        <li><a href="{{ paper.scimago }}" target="_blank">Scimago : {{ paper.scimago_rank }}</a></li>
                        {% endif %}
                        {% if paper.core %}
                        <li><a href="{{ paper.core }}" target="_blank">CORE : {{ paper.core_rank }}</a></li>
                        {% endif %}
                        {% if paper.presentation %}
                        <li><a href="{{ paper.presentation }}" target="_blank"><i class="fas fa-chalkboard-teacher"></i> slides</a></li>
                        {% endif %}
                        {% if paper.poster %}
                        <li><a href="{{ paper.poster }}" target="_blank"><i class="fas fa-image"></i> poster</a></li>
                        {% endif %}
                        {% if paper.demo %}
                        <li><a href="{{ paper.demo }}" target="_blank"><i class="fas fa-desktop"></i> demo</a></li>
                        {% endif %}
                        {% if paper.code %}
                        <li><a href="{{ paper.code }}" target="_blank"><i class="fab fa-github"></i> code</a></li>
                        {% endif %}
                        {% if paper.bibtex %}
                        <li><a href="javascript:void(0);" onclick="copyBibtex('{{ paper.id | default: forloop.index }}', this)"><i class="fas fa-quote-right"></i> BibTeX</a>
                        <pre id="bibtex-{{ paper.id | default: forloop.index }}" style="display:none;">{{ paper.bibtex }}</pre></li>
                        {% endif %}
                    </ul>
                    {% endif %}
                </li>
            {% endfor %}
            </ol>
        {% endfor %}
    </section>
</div>

<script>
function copyBibtex(id, el) {
  const text = document.getElementById("bibtex-" + id).innerText;

  navigator.clipboard.writeText(text.trim()).then(() => {
    const original = el.innerText;
    el.innerText = "Copied!";
    setTimeout(() => {
      el.innerText = original;
    }, 1500);
  });
}
</script>

<script>
  const toggleBtn = document.getElementById('format-toggle');
  const frSection = document.getElementById('hal-section');
  const enSection = document.getElementById('list-section');

  let currentLang = 'list';

  toggleBtn.addEventListener('click', () => {
    if (currentLang === 'hal') {
      frSection.classList.add('hidden');
      enSection.classList.remove('hidden');
      toggleBtn.textContent = 'HAL';
      currentLang = 'list';

    } else {
      enSection.classList.add('hidden');
      frSection.classList.remove('hidden');
      toggleBtn.textContent = 'List';
      currentLang = 'hal';
    }
  });
</script>
