---
layout: post
title: "Reduction"
categories: graph_coloring
---

This post is a demo of the reduction of vertices (see article <a href="https://cyril-grelier.github.io/publications/#IJCAI2023" target="_blank">IJCAI2023</a>).

<style>
.svg_red {
  /* border: 1px solid black; */
  width: 600px;
  height: 600px;
}

.div_red {
  display: flex; /* Affiche les éléments du formulaire en ligne */
  flex-direction: column;
  align-items: center; /* Centre les éléments verticalement */
}

.form_elem {
  margin-right: 10px;
  width: 100%;
  display: inline-block;
  text-align: center;
}

.label_red,
.button_red {
  margin: 0 0 5px 20px;
}

.path {
  stroke-dasharray: 5;
  animation: dash 20s infinite linear;
}

@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}

.span_red {
  margin-right: 18px;
}
</style>

<p>Reduction of vertices (see article <a href="https://cyril-grelier.github.io/publications/#IJCAI2023" target="_blank">IJCAI2023</a>).</p>
<p>Choose the graph with the menu, check original version or uncheck for reduced one, checking WVCP add weights to the graph (no reduced version of 0_test).
Choose the rules to apply and click on "Reduction" button. If "don't stop" is checked, the reduction will be applied until no more vertices can be reduced. Otherwise, click the "play" button to apply the reduction one step at a time.</p>

<div class="div_red">
    <div class="form_elem div_red">
        <select id="graph-select" onchange="loadFileContent()">
            <option value="0_test">0_test</option>
            <option value="miles250">miles250</option>
            <option value="p29">p29</option>
            <option value="p31">p31</option>
            <option value="GEOM80">GEOM80</option>
            <option value="miles1000">miles1000</option>
            <option value="miles1500">miles1500</option>
            <option value="GEOM50">GEOM50</option>
            <option value="GEOM100">GEOM100</option>
            <option value="GEOM40a">GEOM40a</option>
            <option value="GEOM110">GEOM110</option>
            <option value="GEOM50a">GEOM50a</option>
            <option value="GEOM40">GEOM40</option>
            <option value="GEOM60">GEOM60</option>
            <option value="GEOM90b">GEOM90b</option>
            <option value="GEOM30">GEOM30</option>
            <option value="GEOM110b">GEOM110b</option>
            <option value="GEOM120">GEOM120</option>
            <option value="p32">p32</option>
            <option value="GEOM70a">GEOM70a</option>
            <option value="GEOM90">GEOM90</option>
            <option value="GEOM60a">GEOM60a</option>
            <option value="GEOM70b">GEOM70b</option>
            <option value="GEOM20a">GEOM20a</option>
            <option value="GEOM20">GEOM20</option>
            <option value="GEOM40b">GEOM40b</option>
            <option value="GEOM50b">GEOM50b</option>
            <option value="GEOM100b">GEOM100b</option>
            <option value="GEOM60b">GEOM60b</option>
            <option value="GEOM30a">GEOM30a</option>
            <option value="GEOM80b">GEOM80b</option>
            <option value="GEOM120b">GEOM120b</option>
            <option value="GEOM80a">GEOM80a</option>
            <option value="R50_1g">R50_1g</option>
            <option value="R50_1gb">R50_1gb</option>
            <option value="GEOM70">GEOM70</option>
            <option value="p36">p36</option>
            <option value="GEOM20b">GEOM20b</option>
            <option value="p28">p28</option>
            <option value="GEOM30b">GEOM30b</option>
            <option value="p26">p26</option>
            <option value="GEOM90a">GEOM90a</option>
            <option value="p24">p24</option>
            <option value="p25">p25</option>
            <option value="p35">p35</option>
            <option value="p42">p42</option>
            <option value="r07">r07</option>
            <option value="p33">p33</option>
            <option value="p40">p40</option>
            <option value="p38">p38</option>
            <option value="R100_1g">R100_1g</option>
            <option value="r16">r16</option>
            <option value="p21">p21</option>
            <option value="R75_1g">R75_1g</option>
            <option value="R75_1gb">R75_1gb</option>
            <option value="GEOM100a">GEOM100a</option>
            <option value="R100_1gb">R100_1gb</option>
            <option value="p41">p41</option>
            <option value="GEOM120a">GEOM120a</option>
            <option value="r09">r09</option>
            <option value="r05">r05</option>
            <option value="r06">r06</option>
            <option value="r10">r10</option>
            <!--
    <option value="1-FullIns_3">1-FullIns_3</option>
    <option value="1-FullIns_4">1-FullIns_4</option>
    <option value="1-FullIns_5">1-FullIns_5</option>
    <option value="1-Insertions_4">1-Insertions_4</option>
    <option value="1-Insertions_5">1-Insertions_5</option>
    <option value="1-Insertions_6">1-Insertions_6</option>
    <option value="2-FullIns_3">2-FullIns_3</option>
    <option value="2-FullIns_4">2-FullIns_4</option>
    <option value="2-FullIns_5">2-FullIns_5</option>
    <option value="2-Insertions_3">2-Insertions_3</option>
    <option value="2-Insertions_4">2-Insertions_4</option>
    <option value="2-Insertions_5">2-Insertions_5</option>
    <option value="3-FullIns_3">3-FullIns_3</option>
    <option value="3-FullIns_4">3-FullIns_4</option>
    <option value="3-FullIns_5">3-FullIns_5</option>
    <option value="3-Insertions_3">3-Insertions_3</option>
    <option value="3-Insertions_4">3-Insertions_4</option>
    <option value="3-Insertions_5">3-Insertions_5</option>
    <option value="4-FullIns_3">4-FullIns_3</option>
    <option value="4-FullIns_4">4-FullIns_4</option>
    <option value="4-FullIns_5">4-FullIns_5</option>
    <option value="4-Insertions_3">4-Insertions_3</option>
    <option value="4-Insertions_4">4-Insertions_4</option>
    <option value="5-FullIns_3">5-FullIns_3</option>
    <option value="5-FullIns_4">5-FullIns_4</option>
    <option value="abb313GPIA">abb313GPIA</option>
    <option value="anna">anna</option>
    <option value="ash331GPIA">ash331GPIA</option>
    <option value="ash608GPIA">ash608GPIA</option>
    <option value="ash958GPIA">ash958GPIA</option>
    <option value="C2000.5">C2000.5</option>
    <option value="C2000.9">C2000.9</option>
    <option value="C4000.5">C4000.5</option>
    <option value="david">david</option>
    <option value="DSJC1000.1">DSJC1000.1</option>
    <option value="DSJC1000.5">DSJC1000.5</option>
    <option value="DSJC1000.9">DSJC1000.9</option>
    <option value="DSJC125.1">DSJC125.1</option>
    <option value="DSJC125.1gb">DSJC125.1gb</option>
    <option value="DSJC125.1g">DSJC125.1g</option>
    <option value="DSJC125.5">DSJC125.5</option>
    <option value="DSJC125.5gb">DSJC125.5gb</option>
    <option value="DSJC125.5g">DSJC125.5g</option>
    <option value="DSJC125.9">DSJC125.9</option>
    <option value="DSJC125.9gb">DSJC125.9gb</option>
    <option value="DSJC125.9g">DSJC125.9g</option>
    <option value="DSJC250.1">DSJC250.1</option>
    <option value="DSJC250.5">DSJC250.5</option>
    <option value="DSJC250.9">DSJC250.9</option>
    <option value="DSJC500.1">DSJC500.1</option>
    <option value="DSJC500.5">DSJC500.5</option>
    <option value="DSJC500.9">DSJC500.9</option>
    <option value="DSJR500.1c">DSJR500.1c</option>
    <option value="DSJR500.1">DSJR500.1</option>
    <option value="DSJR500.5">DSJR500.5</option>
    <option value="flat1000_50_0">flat1000_50_0</option>
    <option value="flat1000_60_0">flat1000_60_0</option>
    <option value="flat1000_76_0">flat1000_76_0</option>
    <option value="flat300_20_0">flat300_20_0</option>
    <option value="flat300_26_0">flat300_26_0</option>
    <option value="flat300_28_0">flat300_28_0</option>
    <option value="fpsol2.i.1">fpsol2.i.1</option>
    <option value="fpsol2.i.2">fpsol2.i.2</option>
    <option value="fpsol2.i.3">fpsol2.i.3</option>
    <option value="games120">games120</option>
    <option value="GEOM100a">GEOM100a</option>
    <option value="GEOM100b">GEOM100b</option>
    <option value="GEOM100">GEOM100</option>
    <option value="GEOM110a">GEOM110a</option>
    <option value="GEOM110b">GEOM110b</option>
    <option value="GEOM110">GEOM110</option>
    <option value="GEOM120a">GEOM120a</option>
    <option value="GEOM120b">GEOM120b</option>
    <option value="GEOM120">GEOM120</option> -->
            <!-- <option value="GEOM20a">GEOM20a</option>
            <option value="GEOM20b">GEOM20b</option>
            <option value="GEOM20">GEOM20</option>
            <option value="GEOM30a">GEOM30a</option>
            <option value="GEOM30b">GEOM30b</option>
            <option value="GEOM30">GEOM30</option>
            <option value="GEOM40a">GEOM40a</option>
            <option value="GEOM40b">GEOM40b</option>
            <option value="GEOM40">GEOM40</option> -->
            <!-- <option value="GEOM50a">GEOM50a</option>
    <option value="GEOM50b">GEOM50b</option>
    <option value="GEOM50">GEOM50</option>
    <option value="GEOM60a">GEOM60a</option>
    <option value="GEOM60b">GEOM60b</option>
    <option value="GEOM60">GEOM60</option>
    <option value="GEOM70a">GEOM70a</option>
    <option value="GEOM70b">GEOM70b</option>
    <option value="GEOM70">GEOM70</option>
    <option value="GEOM80a">GEOM80a</option>
    <option value="GEOM80b">GEOM80b</option>
    <option value="GEOM80">GEOM80</option>
    <option value="GEOM90a">GEOM90a</option>
    <option value="GEOM90b">GEOM90b</option>
    <option value="GEOM90">GEOM90</option>
    <option value="homer">homer</option>
    <option value="huck">huck</option>
    <option value="inithx.i.1">inithx.i.1</option>
    <option value="inithx.i.2">inithx.i.2</option>
    <option value="inithx.i.3">inithx.i.3</option>
    <option value="jean">jean</option>
    <option value="latin_square_10">latin_square_10</option>
    <option value="le450_15a">le450_15a</option>
    <option value="le450_15b">le450_15b</option>
    <option value="le450_15c">le450_15c</option>
    <option value="le450_15d">le450_15d</option>
    <option value="le450_25a">le450_25a</option>
    <option value="le450_25b">le450_25b</option>
    <option value="le450_25c">le450_25c</option>
    <option value="le450_25d">le450_25d</option>
    <option value="le450_5a">le450_5a</option>
    <option value="le450_5b">le450_5b</option>
    <option value="le450_5c">le450_5c</option>
    <option value="le450_5d">le450_5d</option>
    <option value="miles1000">miles1000</option>
    <option value="miles1500">miles1500</option>
    <option value="miles250">miles250</option>
    <option value="miles500">miles500</option>
    <option value="miles750">miles750</option>
    <option value="mug100_1">mug100_1</option>
    <option value="mug100_25">mug100_25</option>
    <option value="mug88_1">mug88_1</option>
    <option value="mug88_25">mug88_25</option>
    <option value="mulsol.i.1">mulsol.i.1</option>
    <option value="mulsol.i.2">mulsol.i.2</option>
    <option value="mulsol.i.3">mulsol.i.3</option>
    <option value="mulsol.i.4">mulsol.i.4</option>
    <option value="mulsol.i.5">mulsol.i.5</option>
    <option value="myciel3">myciel3</option>
    <option value="myciel4">myciel4</option>
    <option value="myciel5">myciel5</option>
    <option value="myciel5gb">myciel5gb</option>
    <option value="myciel5g">myciel5g</option>
    <option value="myciel6">myciel6</option>
    <option value="myciel6gb">myciel6gb</option>
    <option value="myciel6g">myciel6g</option>
    <option value="myciel7">myciel7</option>
    <option value="myciel7gb">myciel7gb</option>
    <option value="myciel7g">myciel7g</option>
    <option value="p06">p06</option>
    <option value="p07">p07</option>
    <option value="p08">p08</option>
    <option value="p09">p09</option>
    <option value="p10">p10</option>
    <option value="p29">p29</option>
    <option value="p11">p11</option>
    <option value="p12">p12</option>
    <option value="p13">p13</option>
    <option value="p14">p14</option>
    <option value="p15">p15</option>
    <option value="p16">p16</option>
    <option value="p17">p17</option>
    <option value="p18">p18</option>
    <option value="p19">p19</option>
    <option value="p20">p20</option>
    <option value="p21">p21</option>
    <option value="p22">p22</option>
    <option value="p23">p23</option>
    <option value="p24">p24</option>
    <option value="p25">p25</option>
    <option value="p26">p26</option>
    <option value="p27">p27</option>
    <option value="p28">p28</option>
    <option value="p29">p29</option>
    <option value="p30">p30</option>
    <option value="p31">p31</option>
    <option value="p32">p32</option>
    <option value="p33">p33</option>
    <option value="p34">p34</option>
    <option value="p35">p35</option>
    <option value="p36">p36</option>
    <option value="p38">p38</option>
    <option value="p40">p40</option>
    <option value="p41">p41</option>
    <option value="p42">p42</option>
    <option value="qg.order100">qg.order100</option>
    <option value="qg.order30">qg.order30</option>
    <option value="qg.order40">qg.order40</option>
    <option value="qg.order60">qg.order60</option>
    <option value="queen10_10">queen10_10</option>
    <option value="queen10_10gb">queen10_10gb</option>
    <option value="queen10_10g">queen10_10g</option>
    <option value="queen11_11">queen11_11</option>
    <option value="queen11_11gb">queen11_11gb</option>
    <option value="queen11_11g">queen11_11g</option>
    <option value="queen12_12">queen12_12</option>
    <option value="queen12_12gb">queen12_12gb</option>
    <option value="queen12_12g">queen12_12g</option>
    <option value="queen13_13">queen13_13</option>
    <option value="queen14_14">queen14_14</option>
    <option value="queen15_15">queen15_15</option>
    <option value="queen16_16">queen16_16</option>
    <option value="queen5_5">queen5_5</option>
    <option value="queen6_6">queen6_6</option>
    <option value="queen7_7">queen7_7</option>
    <option value="queen8_12">queen8_12</option>
    <option value="queen8_8">queen8_8</option>
    <option value="queen8_8gb">queen8_8gb</option>
    <option value="queen8_8g">queen8_8g</option>
    <option value="queen9_9">queen9_9</option>
    <option value="queen9_9gb">queen9_9gb</option>
    <option value="queen9_9g">queen9_9g</option>
    <option value="r01">r01</option>
    <option value="r02">r02</option>
    <option value="r03">r03</option>
    <option value="r04">r04</option>
    <option value="r05">r05</option>
    <option value="r06">r06</option>
    <option value="r07">r07</option>
    <option value="r08">r08</option>
    <option value="r09">r09</option>
    <option value="r1000.1c">r1000.1c</option>
    <option value="r1000.1">r1000.1</option>
    <option value="r1000.5">r1000.5</option>
    <option value="R100_1gb">R100_1gb</option>
    <option value="R100_1g">R100_1g</option>
    <option value="R100_5gb">R100_5gb</option>
    <option value="R100_5g">R100_5g</option>
    <option value="R100_9gb">R100_9gb</option>
    <option value="R100_9g">R100_9g</option>
    <option value="r10">r10</option>
    <option value="r11">r11</option>
    <option value="r125.1c">r125.1c</option>
    <option value="r125.1">r125.1</option>
    <option value="r125.5">r125.5</option>
    <option value="r12">r12</option>
    <option value="r13">r13</option>
    <option value="r14">r14</option>
    <option value="r15">r15</option>
    <option value="r16">r16</option>
    <option value="r17">r17</option>
    <option value="r18">r18</option>
    <option value="r19">r19</option>
    <option value="r20">r20</option>
    <option value="r21">r21</option>
    <option value="r22">r22</option>
    <option value="r23">r23</option>
    <option value="r24">r24</option>
    <option value="r250.1c">r250.1c</option>
    <option value="r250.1">r250.1</option>
    <option value="r250.5">r250.5</option>
    <option value="r25">r25</option>
    <option value="r26">r26</option>
    <option value="r27">r27</option>
    <option value="r28">r28</option>
    <option value="r29">r29</option>
    <option value="r30">r30</option>
    <option value="R50_1gb">R50_1gb</option>
    <option value="R50_1g">R50_1g</option>
    <option value="R50_5gb">R50_5gb</option>
    <option value="R50_5g">R50_5g</option>
    <option value="R50_9gb">R50_9gb</option>
    <option value="R50_9g">R50_9g</option>
    <option value="R75_1gb">R75_1gb</option>
    <option value="R75_1g">R75_1g</option>
    <option value="R75_5gb">R75_5gb</option>
    <option value="R75_5g">R75_5g</option>
    <option value="R75_9gb">R75_9gb</option>
    <option value="R75_9g">R75_9g</option>
    <option value="school1">school1</option>
    <option value="school1_nsh">school1_nsh</option>
    <option value="wap01a">wap01a</option>
    <option value="wap02a">wap02a</option>
    <option value="wap03a">wap03a</option>
    <option value="wap04a">wap04a</option>
    <option value="wap05a">wap05a</option>
    <option value="wap06a">wap06a</option>
    <option value="wap07a">wap07a</option>
    <option value="wap08a">wap08a</option>
    <option value="will199GPIA">will199GPIA</option>
    <option value="zeroin.i.1">zeroin.i.1</option>
    <option value="zeroin.i.2">zeroin.i.2</option>
    <option value="zeroin.i.3">zeroin.i.3</option>
-->
        </select>
        <label class="label_red"> original <input type="checkbox" name="original" id="cb-original" onchange="loadFileContent()" checked></label>
        <label class="label_red"> WVCP <input type="checkbox" name="weights" id="cb-weights" onchange="loadFileContent()" checked></label>
        <button class="button_red" id="processButton" onclick="loadGraph()">Load</button>
    </div>
    <div class="form_elem div_red">
        <label class="label_red"> R0 <input type="checkbox" name="R0" id="cb-r0" checked></label>
        <label class="label_red"> R1 <input type="checkbox" name="R1" id="cb-r1" checked></label>
        <label class="label_red"> R2 <input type="checkbox" name="R2" id="cb-r2" checked></label>
        <label class="label_red"> Iterate <input type="checkbox" name="iter" id="cb-iter" checked></label>
        <button class="button_red" id="reduction" onclick="reduction()">Reduction</button>
    </div>
    <div class="form_elem div_red">
        <button class="button_red" id="play">play</button>
        <label> don't stop <input type="checkbox" name="dont_stop" id="cb-dont_stop" checked></label>
    </div>
    <div class="form_elem div_red">
        Nb Vertices : <span class="span_red" id="nb_vertices"></span> R0: <span class="span_red" id="r0"></span> R1: <span class="span_red" id="r1"></span> R2: <span class="span_red" id="r2"></span> Total: <span class="span_red" id="total"></span> Iter: <span class="span_red" id="iter"></span> Nb Vertices after reduction : <span class="span_red" id="nb_vertices_red"></span>
    </div>
</div>
<div class="div_red">
    <svg class="svg_red" id="graph-container"></svg>
    <span id="span_info_red"></span>
</div>

<script src="../../../../scripts/reduction.js"></script>
