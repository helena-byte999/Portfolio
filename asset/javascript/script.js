// Preloader
$(document).ready(function () {
    setTimeout(function () {
        $('.wrapper').addClass('loaded');
    }, 2500);
});

// olivia moswa text
document.getElementsByClassName("olivia_moswa")[0];
// olivia moswa text end

// designer text
var designerTexts = ["Product Designer", "Product Manager", "AI Engineer", "Software Engineer"];
var designerIndex = 0;
intervalTime = 800;
function displayText() {
    document.querySelector('.designer').innerText = designerTexts[designerIndex];
    designerIndex = (designerIndex + 1) % designerTexts.length;
}
displayText();
setInterval(displayText, intervalTime * 3);
// designer text end

// card Tabs
var tabs = document.getElementById('icetab-container').children;
var tabcontents = document.getElementById('icetab-content').children;

var mybtn = function () {
    var tabchange = this.mynum;
    for (var int = 0; int < tabcontents.length; int++) {
        tabcontents[int].className = 'tabcontent';
        if (tabs[int].className = 'icetab') {
            tabs[int].className = 'icetab';
            this.classList.add('current-tab');
            tabcontents[int].className = 'tabcontent'
            tabcontents[tabchange].classList.add('tab-active');
        }
    }
}

for (var index = 0; index < tabs.length; index++) {
    tabs[index].mynum = index;
    tabs[index].addEventListener('click', mybtn, false);
}
// card Tabs end

// circle Img my project click event
const elements = document.getElementById("portfolio");
const homeNavabr = document.getElementById("home");
const circular_imgClick = document.getElementsByClassName("circular_text_main");

circular_imgClick[0].addEventListener("click", () => {
    homeNavabr.classList.remove("tab-active");
    elements.classList.add("tab-active");
});

// Dark/ Light Mode Toggle
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    var sunIcon = document.getElementById("sunIcon");
    var moonIcon = document.getElementById("moonIcon");

    if (element.classList.contains("dark-mode")) {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
        localStorage.setItem("mode", "dark");
    } else {
        moonIcon.classList.add("hidden");
        sunIcon.classList.remove("hidden");
        localStorage.setItem("mode", "light");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark") {
        document.body.classList.add("dark-mode");
        var sunIcon = document.getElementById("sunIcon");
        var moonIcon = document.getElementById("moonIcon");
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
    }
});
// Dark/ Light Mode Toggle end

// Portfolio Pop-up — Kuda
$(".pop-up").on("click", function () {
    $(".overlay").not("#ux-overlay").addClass("is-on");
});
$("#close").on("click", function () {
    $(".overlay").not("#ux-overlay").removeClass("is-on");
});

// Portfolio Pop-up — UX
$(".ux-pop-up").on("click", function () {
    $("#ux-overlay").addClass("is-on");
});
$("#ux-close").on("click", function () {
    $("#ux-overlay").removeClass("is-on");
});
// Portfolio Pop-up end

// Share Btn
$(document).ready(function () {
    $(".share-btn").click(function (e) {
        $('.networks-5').not($(this).next(".networks-5")).each(function () {
            $(this).removeClass("active");
        });
        $(this).next(".networks-5").toggleClass("active");
    });
});
// Share Btn End

// Testimonial Card Slider
$(function () {
    $('.testimonials_card').on('init', function (event, slick) {
        $(this).append('<div class="slick-counter"><span class="current"></span> / <span class="total"></span></div>');
        $('.current').text(slick.currentSlide + 1);
        $('.total').text(slick.slideCount);
    })
        .slick({
            autoplay: true,
            autoplaySpeed: 3000,
            infinite: true,
            arrows: true,
            prevArrow: '<span class="prev-arrow"><i class="ri-arrow-left-s-line"></i></span>',
            nextArrow: '<span class="next-arrow"><i class="ri-arrow-right-s-line"></i></span>',
        })
        .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            $('.current').text(nextSlide + 1);
        });
});
// Testimonial Card Slider End

// Kuda Teens Case Study Carousel
var kudaSlides = [
    {
        title: 'Problem Statement',
        text: 'Teens in Nigeria lacked a safe, controlled way to access and manage money. Parents had no visibility into their child\'s spending. I led the product strategy for Kuda Teens — a prepaid debit card and digital banking experience built for teens aged 11–18 and their parents.'
    },
    {
        title: 'Market Research',
        text: 'I conducted market research segmented across demographics, geography, psychographics, and behaviours — identifying tech-savvy, budget-conscious parents and financially curious teens as the core audience, primarily across urban and rural Nigeria.'
    },
    {
        title: 'Assumption Mapping',
        text: 'I mapped and scored product assumptions by importance and risk to identify which needed validation first. The highest priority assumption — that parents require parental controls to regulate teen spending — scored 10 on importance, driving early design decisions.'
    },
    {
        title: 'Risk Importance Graph',
        text: 'Assumptions were plotted on a risk vs. importance matrix to surface the most critical unknowns. Items in the high-importance, high-risk quadrant — such as merchant acceptance and parental control features — were prioritised for early validation.'
    },
    {
        title: 'User Research — Parents',
        text: 'I interviewed 5 parents and 3 teens using a structured survey. Parents prioritised transparency and control; teens wanted financial independence and customisable card designs. These insights directly shaped the product\'s feature set.'
    },
    {
        title: 'User Research — Teens',
        text: 'Teen interviews revealed a strong desire for financial independence, personalised card aesthetics, and the ability to purchase digital goods. These needs were mapped directly to product features including virtual card customisation and gift card support.'
    },
    {
        title: 'Key Findings',
        text: 'Research revealed two distinct user needs: parents wanted oversight and financial literacy tools, while teens wanted autonomy, personalisation, and easy access to money for everyday purchases including digital gift cards and gaming.'
    },
    {
        title: 'Feature Prioritisation',
        text: 'Using the MoSCoW framework combined with T-shirt sizing, I prioritised features across four pillars: Security & Privacy, Digital Experience, Card Design, and Parent Controls — ensuring MVP scope was achievable without compromising core value.'
    },
    {
        title: 'MVP Definition',
        text: 'I mapped all features on a Value vs. Effort matrix to define the MVP. Quick wins like data privacy, login, and virtual card activation were prioritised first, while social features and interactive budgeting tools were scoped for later releases.'
    },
    {
        title: 'User Stories',
        text: 'I wrote user stories for both personas to keep the team aligned on outcomes. Stories covered transaction visibility, spending limits, real-time notifications, and financial education — forming the foundation of the product backlog.'
    }
];

$(function () {
    if ($('.kuda_case_slider').length) {
        $('.kuda_case_slider').slick({
            centerMode: true,
            centerPadding: '70px',
            slidesToShow: 1,
            infinite: true,
            autoplay: false,
            arrows: true,
            dots: true,
            prevArrow: '<span class="kuda_prev_arrow"><i class="ri-arrow-left-s-line"></i></span>',
            nextArrow: '<span class="kuda_next_arrow"><i class="ri-arrow-right-s-line"></i></span>',
        }).on('afterChange', function (e, slick, currentSlide) {
            var s = kudaSlides[currentSlide];
            $('#kuda_slide_title').text(s.title);
            $('#kuda_slide_text').text(s.text);
        });
    }
});
// Kuda Teens Case Study Carousel End

// UFit UX Case Study Carousel
var uxSlides = [
    {
        title: 'Project Overview',
        text: 'UFit is a mobile fitness and nutrition app designed to help users track workouts, set goals, and receive personalised meal recommendations. Using design thinking and user-centred design principles, I led the full UX process — from user research through to prototype testing — to create an intuitive and motivating health experience.'
    },
    {
        title: 'User Research',
        text: 'I conducted structured user interviews using a prepared script to gather insights on users\' fitness habits, nutritional tracking behaviours, and pain points with existing apps. Questions explored workout types, diet preferences, app usage, meal logging methods, and interest in personalised coaching features.'
    },
    {
        title: 'Affinity Map',
        text: 'Interview responses were synthesised into an affinity map, grouping findings into eight key themes: exercise preferences, workout frequency, fitness tracking, nutritional tracking, diet and nutrition, additional features, fitness goals, and nutritional goals. This helped identify patterns and prioritise features.'
    },
    {
        title: 'User Persona',
        text: 'Based on research findings, I created a primary user persona — Sarah Jones, a 27-year-old software engineer and fitness enthusiast. Sarah struggles to balance her busy career with her fitness routine and needs a flexible, personalised app that integrates workout tracking, nutrition planning, and motivational incentives aligned with her lifestyle.'
    },
    {
        title: 'Problem Statement',
        text: 'How might we enhance the UFit fitness app to better support busy professionals like Sarah in achieving their fitness and nutrition goals — providing flexible workout plans, comprehensive nutritional tracking, and motivational incentives to keep them consistently on track?'
    },
    {
        title: 'Lightning Demo — Competitor Analysis',
        text: 'I conducted a lightning demo — a rapid review of existing fitness apps — analysing how competitors handle metrics and features, personalisation, goal setting, workout plans, and meal preferences. This informed design decisions and helped identify gaps UFit could fill.'
    },
    {
        title: 'Brainstorming',
        text: 'Using a collaborative brainstorming session, the team generated feature ideas across three focus areas — AI-powered food analysis, personalised workout creation, fitness social feeds, challenge hubs, allergy detection, wearable integration, and progress sharing. Ideas were evaluated for feasibility and user value.'
    },
    {
        title: 'Lo-Fi Wireframes — Part 1',
        text: 'I sketched low-fidelity wireframes to map out the core user flows — including the home dashboard, meal plan, workout tracker, community feed, wearables, coach screen, profile, and settings. These hand-drawn sketches were used to validate the information architecture before moving to digital prototyping.'
    },
    {
        title: 'Lo-Fi Wireframes — Part 2',
        text: 'A second round of lo-fi sketches refined the login flow, workout plan selection, and progress logging screens. Exploring different navigation patterns and onboarding structures, these sketches converged on a flow that minimised steps while capturing key personalisation data upfront.'
    },
    {
        title: 'Whimsical Prototype',
        text: 'Using Whimsical, I built a mid-fidelity prototype showing five key screens: the home dashboard with daily stats, the log-in-a-plan selector, the workout plan screen with categories and days, the logged-in confirmation screen, and the weekly progress report. The prototype was used directly in usability testing.'
    },
    {
        title: 'Usability Testing — Flow 1',
        text: 'I designed and conducted structured usability testing, walking participants through key app flows. Flow 1 tested home dashboard navigation and workout logging. Users were asked to locate where they would log a workout — most navigated via the plus icon on the navbar, validating the navigation pattern and dashboard clarity.'
    },
    {
        title: 'Usability Testing — Flow 2',
        text: 'Flow 2 tested the "Log In a Plan" screen and category navigation. Users were asked which screen they thought they were on and where they would log their workouts. Feedback confirmed that the workout card labelling was intuitive, directly informing final copy and icon decisions in the high-fidelity design.'
    }
];

$(function () {
    if ($('.ux_case_slider').length) {
        $('.ux_case_slider').slick({
            centerMode: true,
            centerPadding: '70px',
            slidesToShow: 1,
            infinite: true,
            autoplay: false,
            arrows: true,
            dots: true,
            prevArrow: '<span class="kuda_prev_arrow"><i class="ri-arrow-left-s-line"></i></span>',
            nextArrow: '<span class="kuda_next_arrow"><i class="ri-arrow-right-s-line"></i></span>',
        }).on('afterChange', function (e, slick, currentSlide) {
            var s = uxSlides[currentSlide];
            $('#ux_slide_title').text(s.title);
            $('#ux_slide_text').text(s.text);
        });
    }
});
// UFit UX Case Study Carousel End

// View More View Less btn
$(document).ready(function () {
    $("#toggle").click(function () {
        var elem = $("#toggle").text();
        if (elem == "View More") {
            $("#toggle").text("View Less");
            $("#text").slideDown();
        } else {
            $("#toggle").text("View More");
            $("#text").slideUp();
        }
    });
});
// View More View Less btn End

// blog Page Pop Up
$(document).ready(function () {
    $('.trigger').click(function () {
        $('.modal-wrapper').toggleClass('open');
        $('.page-wrapper').toggleClass('blur');
        return false;
    });
});
// blog Page Pop Up End

// blog_pop_up_slider
$(function () {
    $('.blog_pop_up_slider').slick({
        infinity: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        prevArrow: '<span class="prev-btn"><i class="fa-solid fa-arrow-left"></i> Prev </span>',
        nextArrow: '<span class="next-btn"> Next <i class="fa-solid fa-arrow-right"></i> </span>',
        responsive: [
            {
                breakpoint: 645,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    arrows: false,
                }
            }
        ]
    });
});
// blog_pop_up_slider end

// form
$('input').focus(function () {
    $(this).parent().addClass('active');
    $('input').focusout(function () {
        if ($(this).val() == '') {
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().addClass('active');
        }
    })
});
// form end


// cursor
let cursor = document.querySelector('.cursor');
let cursorScale = document.querySelectorAll('a,button,.pop-up,.trigger,.share,#close,.toggle,#vimeo,#youtube,.link,.gallery');
let mouseX = 0;
let mouseY = 0;

gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat: function () {
        gsap.set(cursor, {
            css: {
                left: mouseX,
                top: mouseY,
            }
        })
    }
});

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
})
cursorScale.forEach(link => {
    link.addEventListener('mousemove', () => {
        cursor.classList.add('grow');
        if (link.classList.contains('small')) {
            cursor.classList.remove('grow');
            cursor.classList.add('grow-small');
        }
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('grow');
        cursor.classList.remove('grow-small');
    });
});

// Whole Page Scrolling Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.fade_up');
hiddenElements.forEach((el) => observer.observe(el));


// pop video
$(document).ready(function () {
    $('#vimeo').magnificPopup({
        items: {
            src: 'https://vimeo.com/259411563'
        },
        type: 'iframe'
    });

    $('#youtube').magnificPopup({
        items: {
            src: 'https://www.youtube.com/watch?v=OZzoAw9QHXY'
        },
        type: 'iframe'
    });

    $('.link').magnificPopup({
        type: 'soundcloud',
        items: {
            src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/163522130&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
        },
        type: 'iframe',
    });

});

// gallary code
window.addEventListener("load", () => {
    for (let i of document.querySelectorAll(".gallery img")) {
        i.onclick = () => i.classList.toggle("full");
    }
});

// skill bar function
$(function () {
    $('.circlechart').circlechart();
});

// Featured Medium Article
function loadFeaturedArticle() {
    var articleUrl = 'https://medium.com/@otuokonhelena/youre-not-discovering-music-ai-is-deciding-it-for-you-a22f27cf9921';
    var apiUrl = 'https://api.microlink.io?url=' + encodeURIComponent(articleUrl);
    var container = document.getElementById('featured-article');
    if (!container) return;

    fetch(apiUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.status !== 'success') throw new Error('failed');
            var d = data.data;
            var imgUrl = (d.image && d.image.url) ? d.image.url : '';
            var title = d.title || "You're Not Discovering Music — AI Is Deciding It for You";
            var desc = d.description || 'A deep dive into how AI algorithms shape what we listen to — and what that means for music discovery.';
            container.innerHTML =
                '<a class="featured-card" href="' + articleUrl + '" target="_blank" rel="noopener noreferrer">' +
                    (imgUrl ? '<img class="featured-card__thumb" src="' + imgUrl + '" alt="featured article thumbnail">' : '') +
                    '<div class="featured-card__body">' +
                        '<p class="featured-card__tag">Featured · Medium</p>' +
                        '<h3 class="featured-card__title">' + title + '</h3>' +
                        '<p class="featured-card__desc">' + desc + '</p>' +
                        '<p class="featured-card__read">Read on Medium →</p>' +
                    '</div>' +
                '</a>';
        })
        .catch(function() {
            container.innerHTML =
                '<a class="featured-card" href="' + articleUrl + '" target="_blank" rel="noopener noreferrer">' +
                    '<div class="featured-card__body" style="padding:24px;">' +
                        '<p class="featured-card__tag">Featured · Medium</p>' +
                        '<h3 class="featured-card__title">You\'re Not Discovering Music — AI Is Deciding It for You</h3>' +
                        '<p class="featured-card__desc">A deep dive into how AI algorithms shape what we listen to — and what that means for authentic music discovery.</p>' +
                        '<p class="featured-card__read">Read on Medium →</p>' +
                    '</div>' +
                '</a>';
        });
}
loadFeaturedArticle();

// Medium RSS Feed
function fetchMediumPosts() {
    var mediumUser = 'otuokonhelena';
    var rssUrl = 'https://medium.com/feed/@' + mediumUser;
    var apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl) + '&count=6';
    var container = document.getElementById('medium-posts');
    if (!container) return;

    fetch(apiUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.status !== 'ok' || !data.items || !data.items.length) {
                container.innerHTML = '<p class="web_development font_w_font_s1">No articles found yet. <a href="https://medium.com/@' + mediumUser + '" target="_blank" style="color:#9B00A3;">Visit Medium profile</a></p>';
                return;
            }
            container.innerHTML = data.items.map(function(post) {
                var date = new Date(post.pubDate);
                var day = date.getDate();
                var month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                var thumb = post.thumbnail || post.description.match(/src="([^"]+)"/)?.[1] || '';
                var bgStyle = thumb ? 'background-image: url("' + thumb + '"); background-size: cover; background-position: center;' : '';
                var category = (post.categories && post.categories[0]) ? post.categories[0] : 'article';
                return '<div class="fade_up">' +
                    '<a href="' + post.link + '" target="_blank" rel="noopener noreferrer">' +
                        '<div class="blog_img" style="' + bgStyle + '">' +
                            '<div class="blog_date">' +
                                '<h4 class="date font_w_font_s">' + day + ' <span class="month">' + month + '</span></h4>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                    '<h3 class="become font_w_font_s">' + post.title + '</h3>' +
                    '<p class="web_development font_w_font_s1">' + category + '</p>' +
                '</div>';
            }).join('');
        })
        .catch(function() {
            container.innerHTML = '<p class="web_development font_w_font_s1">Unable to load articles. <a href="https://medium.com/@' + mediumUser + '" target="_blank" style="color:#9B00A3;">Visit Medium profile</a></p>';
        });
}
fetchMediumPosts();

// File upload
document.addEventListener('DOMContentLoaded', function () {
    var area = document.getElementById('file_upload_area');
    var input = document.getElementById('file_upload');
    var trigger = document.getElementById('file_upload_trigger');
    var list = document.getElementById('file_upload_list');
    if (!area) return;

    var selectedFiles = [];

    function renderFiles() {
        list.innerHTML = '';
        selectedFiles.forEach(function (file, idx) {
            var li = document.createElement('li');
            li.className = 'file_item';
            li.innerHTML =
                '<i class="ri-file-line"></i>' +
                '<span>' + file.name + '</span>' +
                '<i class="ri-close-line file_remove" data-idx="' + idx + '"></i>';
            list.appendChild(li);
        });
        list.querySelectorAll('.file_remove').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                selectedFiles.splice(parseInt(this.dataset.idx), 1);
                renderFiles();
            });
        });
    }

    trigger.addEventListener('click', function () { input.click(); });

    input.addEventListener('change', function () {
        Array.from(this.files).forEach(function (f) { selectedFiles.push(f); });
        renderFiles();
        input.value = '';
    });

    area.addEventListener('dragover', function (e) {
        e.preventDefault();
        area.classList.add('dragging');
    });
    area.addEventListener('dragleave', function () { area.classList.remove('dragging'); });
    area.addEventListener('drop', function (e) {
        e.preventDefault();
        area.classList.remove('dragging');
        Array.from(e.dataTransfer.files).forEach(function (f) {
            var ext = f.name.split('.').pop().toLowerCase();
            if (['png','pdf','pptx','doc','docx'].indexOf(ext) !== -1) selectedFiles.push(f);
        });
        renderFiles();
    });
});

// Mobile hamburger nav
document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger_btn');
    var overlay = document.getElementById('mobile_nav_overlay');
    if (!hamburger || !overlay) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        overlay.classList.toggle('open');
    });

    // Close when clicking outside the drawer
    overlay.addEventListener('click', function (e) {
        if (!e.target.closest('.mobile_nav_drawer') && !e.target.closest('.hamburger_btn')) {
            hamburger.classList.remove('active');
            overlay.classList.remove('open');
        }
    });

    // Tab switching via mobile nav
    document.querySelectorAll('.mobile_nav_item').forEach(function (item) {
        item.addEventListener('click', function () {
            var idx = parseInt(this.dataset.tab);
            var desktopTabs = document.getElementById('icetab-container').children;
            if (desktopTabs[idx]) desktopTabs[idx].click();
            // update active state
            document.querySelectorAll('.mobile_nav_item').forEach(function (i) { i.classList.remove('active'); });
            item.classList.add('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('open');
        });
    });

    // Set first item active initially
    var first = document.querySelector('.mobile_nav_item[data-tab="0"]');
    if (first) first.classList.add('active');
});

// Custom country code dropdown
document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.getElementById('custom_code_select');
    if (!wrapper) return;
    var trigger = document.getElementById('code_trigger');
    var options = document.getElementById('code_options');
    var hiddenInput = document.getElementById('phone_code');
    var codeValue = wrapper.querySelector('.code_value');

    trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        wrapper.classList.toggle('open');
    });

    options.querySelectorAll('.code_option').forEach(function (li) {
        li.addEventListener('click', function () {
            options.querySelectorAll('.code_option').forEach(function (l) { l.classList.remove('selected'); });
            li.classList.add('selected');
            codeValue.textContent = li.textContent;
            hiddenInput.value = li.dataset.value;
            wrapper.classList.remove('open');
        });
    });

    document.addEventListener('click', function () {
        wrapper.classList.remove('open');
    });
});

// Contact Form Submission via Web3Forms
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    var statusEl = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Combine phone code + number into one field
        var code = document.getElementById('phone_code').value;
        var num = document.getElementById('phone').value;
        var phoneInput = form.querySelector('input[name="phone"]');
        var combined = code + ' ' + num;
        phoneInput.value = combined;

        var formData = new FormData(form);

        statusEl.style.display = 'block';
        statusEl.style.color = '#9B00A3';
        statusEl.textContent = 'Sending…';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                statusEl.style.color = '#9B00A3';
                statusEl.textContent = 'Message sent! I\'ll be in touch soon.';
                form.reset();
            } else {
                statusEl.style.color = '#c0392b';
                statusEl.textContent = 'Something went wrong. Please try again.';
            }
        })
        .catch(function () {
            statusEl.style.color = '#c0392b';
            statusEl.textContent = 'Network error. Please try again.';
        });
    });
});