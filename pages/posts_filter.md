---
layout: archive
permalink: /arduino
title: ""
author_profile: true
filterby: "iot"
---


{% include group-by-array collection=site.posts field="categories" %}


{% for tag in group_names %}
{% if tag contains page.filterby %}
<a href="/tags?tag=SAP" class="btn btn--info animated wow rubberBand" title="Get content tagged with SAP">
<i class="fas fa-tag"></i>
        {{ page.filterby }}
</a>
  {% assign posts = group_items[forloop.index0] %}
  <!--<h2 id="{{ tag | slugify }}" class="archive__subtitle">dd{{ tag }}</h2>-->
  {% for post in posts %}
    {% include archive-single.html %}
  {% endfor %}

 {% endif %}
{% endfor %}


 