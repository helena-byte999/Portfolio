/* ---------------------------------------------------------------
   GitHub projects feed — renders public repos into #gh-repos
   --------------------------------------------------------------- */
(function () {
    var USERNAME = 'helena-byte999';
    var grid = document.getElementById('gh-repos');
    if (!grid) return;

    /* Repos I want surfaced first, and the wording I want on them.
       Anything not listed still shows, just after these.            */
    var CURATED = {
        'MovieRec': {
            title: 'MOV.IE REC',
            desc: 'A production-ready, Netflix-style recommender built end to end — ML pipeline, data engineering and live deployment.'
        },
        'sony-digital-partnerships': {
            title: 'Sony Music — Application Site',
            desc: 'A bespoke application site built for the Digital Partnerships internship at Sony Music UK \u2014 music, product and events in one place.'
        },
        'Portfolio': {
            title: 'This Portfolio',
            desc: 'My personal site — hand-built front end, dynamic Medium feed, dark mode and all.'
        }
    };

    /* Language colours, roughly GitHub's own */
    var LANG_COLORS = {
        JavaScript: '#F1E05A',
        Python: '#3572A5',
        HTML: '#E34C26',
        CSS: '#563D7C',
        TypeScript: '#3178C6',
        Java: '#B07219',
        Dart: '#00B4AB',
        Jupyter: '#DA5B0B',
        'Jupyter Notebook': '#DA5B0B'
    };

    function esc(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function card(repo) {
        var meta = CURATED[repo.name] || {};
        var title = meta.title || repo.name.replace(/[-_]/g, ' ');
        var desc = meta.desc || repo.description || 'No description yet.';
        var lang = repo.language;
        var dot = LANG_COLORS[lang] || '#6F0075';

        var langHtml = lang
            ? '<span class="gh_repo_lang"><span class="gh_lang_dot" style="background:' +
              esc(dot) + '"></span>' + esc(lang) + '</span>'
            : '';

        var starHtml = repo.stargazers_count
            ? '<span class="gh_repo_meta"><i class="ri-star-line"></i>' + repo.stargazers_count + '</span>'
            : '';

        var updated = repo.updated_at
            ? '<span class="gh_repo_meta"><i class="ri-time-line"></i>Updated ' +
              new Date(repo.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) +
              '</span>'
            : '';

        return '' +
            '<a class="gh_repo_card" href="' + esc(repo.html_url) + '" target="_blank" rel="noopener">' +
                '<div class="gh_repo_top">' +
                    '<i class="ri-git-repository-line"></i>' +
                    '<h3 class="gh_repo_name">' + esc(title) + '</h3>' +
                '</div>' +
                '<p class="gh_repo_desc">' + esc(desc) + '</p>' +
                '<div class="gh_repo_foot">' + langHtml + starHtml + updated + '</div>' +
            '</a>';
    }

    /* Shown if the API is unreachable or rate-limited, so the section
       is never empty in front of a recruiter. */
    function fallback() {
        return Object.keys(CURATED).map(function (name) {
            return card({
                name: name,
                html_url: 'https://github.com/' + USERNAME + '/' + name,
                description: null,
                language: null,
                stargazers_count: 0,
                updated_at: null
            });
        }).join('');
    }

    fetch('https://api.github.com/users/' + USERNAME + '/repos?per_page=100&sort=updated')
        .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.json();
        })
        .then(function (repos) {
            if (!Array.isArray(repos) || !repos.length) throw new Error('empty');

            var order = Object.keys(CURATED);
            repos = repos.filter(function (r) { return !r.fork; });
            repos.sort(function (a, b) {
                var ia = order.indexOf(a.name), ib = order.indexOf(b.name);
                if (ia !== -1 || ib !== -1) {
                    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
                }
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

            grid.innerHTML = repos.map(card).join('');
        })
        .catch(function () {
            grid.innerHTML = fallback();
        });
})();
