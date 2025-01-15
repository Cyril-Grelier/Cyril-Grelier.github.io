---
layout: post
title: "Primal and Dual Relationship in Linear Programming"
categories: [ampl, vscode, linear-programming]
---

In this post, we will discuss the Farmer's Problem as an example of formulating primal and dual problems in linear programming.

The application case comes from the Operations Research course at Les Mines Nancy (France) by Bernardetta Addis.

- [Application Case: Farmer's Problem](#application-case-farmers-problem)
- [Primal Problem Formulation](#primal-problem-formulation)
  - [Original Formulation (in €/hectare, with actual units)](#original-formulation-in-hectare-with-actual-units)
  - [Rescaled Formulation](#rescaled-formulation)
  - [Graphical Representation](#graphical-representation)
  - [Primal AMPL Code](#primal-ampl-code)
- [Dual Problem Formulation](#dual-problem-formulation)
  - [Dual AMPL Code](#dual-ampl-code)
- [Primal-Dual Relationship](#primal-dual-relationship)
- [Interpreting Slack and Body](#interpreting-slack-and-body)
- [Conclusion](#conclusion)

## Application Case: Farmer's Problem

A farmer has 12 hectares of land to cultivate tomatoes and/or potatoes.  
He also has 70 kg of tomato seeds, 18 t of tubers, and 160 m³ of water.

- **Profit**:  
  - Tomatoes: 3000 € per hectare  
  - Potatoes: 5000 € per hectare  

- **Resource Usage** per hectare:  
  - Tomatoes: 7 kg of seeds, 10 m³ of water  
  - Potatoes: 3 t of tubers, 20 m³ of water  

- **Resource Availability**:  
  - 12 hectares of land  
  - 160 m³ of water  
  - 70 kg of tomato seeds  
  - 18 t of potato tubers  

The farmer wants to decide how many hectares of tomatoes (\(x_t\)) and potatoes (\(x_p\)) to cultivate in order to **maximize the total profit**.

| veg       | avail  | profit/hectare  | seeds/hectare | water/hectare |
|-----------|--------|-----------------|---------------|---------------|
| tomatoes  | 70 kg  | 3000 €          | 7 kg          | 10 m³         |
| potatoes  | 18 t   | 5000 €          | 3 t           | 20 m³         |

## Primal Problem Formulation

### Original Formulation (in €/hectare, with actual units)

**Variables**  

- $$x_t \ge 0$$ : number of hectares of tomatoes  
- $$x_p \ge 0$$ : number of hectares of potatoes  

**Objective function** (in €):  

$$\max \; 3000 x_t + 5000 x_p$$

**Constraints**:

$$
\begin{aligned}
    &x_t + x_p \leq 12 &&\text{(Land)} \\
    &10x_t + 20x_p \leq 160 &&\text{(Water)} \\
    &7x_t \leq 70 &&\text{(Tomato seeds)} \\
    &3x_p \leq 18 &&\text{(Potato seeds)} \\
    &x_t, x_p \geq 0 &&\text{(Non-negativity)}
\end{aligned}
$$

### Rescaled Formulation

As the profit in € per hectare is quite high, it is more convenient to rescale the problem by dividing all the coefficients by 1000, turning the profit into k€.
Similarly, we can rescale the constraints:

**Objective function** (in k€):

$$\max \; 3x_t + 5x_p$$

**Constraints**:

$$
\begin{aligned}
    &x_t + x_p \leq 12 &&\text{(Land)} \\
    &x_t + 2x_p \leq 16 &&\text{(Water: dividing by 10)} \\
    &x_t \leq 10 &&\text{(Tomato seeds: dividing by 7)} \\
    &x_p \leq 6 &&\text{(Potato seeds: dividing by 3)} \\
    &x_t, x_p \geq 0 &&\text{(Non-negativity)}
\end{aligned}
$$

### Graphical Representation

Since we have only two variables ($$x_t$$, $$x_p$$), we can plot the problem in a 2D graph with a tool like [GeoGebra](https://www.geogebra.org/).

In the graph below, $$x$$ represents $$x_t$$ and $$y$$ represents $$x_p$$.
You can activate or deactivate the constraints by clicking on the corresponding circle on the left.
The value of the objective function is represented by the variable $$profit$$ that you can modify with the slider.
When the objective function is maximized, at the intersection of the two constraints `land` and `water`, the optimal solution is the point (8,4) with a profit of 44k€.

<div id="ggbApplet"></div>

### Primal AMPL Code

We can also solve this problem with [AMPL](https://ampl.com/), a modeling language for mathematical programming. See the [tutorial to install it](/ampl/vscode/2025/01/06/ampl_vscode.html).

File: `farmer_primal.mod`

```ampl
# Variables
var x_T >=0;
var x_P >=0;

# Objective function
maximize profit: 3*x_T + 5*x_P;

# Constraints (s.t. = subject to)
s.t. land: x_T + x_P <=12;
s.t. water: x_T + 2*x_P <= 16;
s.t. tomato_seed: x_T <= 10;
s.t. potato_seed: x_P <= 6;
```

File: `farmer_primal.run`

```ampl
reset;

# Load the model
model farmer_primal.mod;

# Use the Gurobi solver and solve the problem
option solver gurobi;
solve;

# Display the results (variables, constraints, objective function)
display 
    x_T,
    x_P,
    land.body,
    land.slack,
    land.dual,
    water.body,
    water.slack,
    water.dual,
    tomato_seed.body,
    tomato_seed.slack,
    tomato_seed.dual,
    potato_seed.body,
    potato_seed.slack,
    potato_seed.dual,
    profit;
```

AMPL output :

```bash
include "farmer_primal.run";
ampl: Gurobi 12.0.0: optimal solution; objective 44
2 simplex iterations
x_T = 8
x_P = 4
land.body = 12
land.slack = 0
land.dual = 1
water.body = 16
water.slack = 0
water.dual = 2
tomato_seed.body = 8
tomato_seed.slack = 2
tomato_seed.dual = 0
potato_seed.body = 4
potato_seed.slack = 2
potato_seed.dual = 0
profit = 44
```

Primal optimal solution : $x_T = 8$, $x_P = 4$ with a profit of 44 (44k€).

Notice the output:

- `land.body = 12` means the total used land is 12 hectares.
- `land.slack = 0` means there is no leftover land.
- `land.dual = 1` is the shadow price for the land constraint (see dual problem below).

## Dual Problem Formulation

We now look at the dual of the Farmer’s Problem.

If the primal is in the form

$$\max \; c^T x \quad \text{ subject to } \quad Ax \leq b, \quad x \geq 0$$

then its dual is

$$\min \; b^T y \quad \text{ subject to } \quad A^T y \geq c, \quad y \geq 0.$$

> Note:
>
> For more details about the duality and the different forms of
> the primal and dual problems, as well as the conversion
> between them, you can look at the course or in the book
> "Understanding and Using linear programming" by
> Jiří Matoušek and Bernd Gärtner
> (or any other book on linear programming, there are many).

From the primal:

$$\max \; 3x_t + 5x_p$$

Subject to:

$$
\begin{aligned}
    &x_t + x_p \leq 12 &&\text{(Land)} \\
    &x_t + 2x_p \leq 16 &&\text{(Water)} \\
    &x_t \leq 10 &&\text{(Tomato seeds)} \\
    &x_p \leq 6 &&\text{(Potato seeds)} \\
    &x_t, x_p \geq 0 &&\text{(Non-negativity)}
\end{aligned}
$$

We rewrite it in matrix form:

$$\max \; c^T x$$

$$
Ax \leq b
$$

$$
x \geq 0
$$

Where

$$
c = \begin{bmatrix}
    3 \\
    5
\end{bmatrix}

A = \begin{bmatrix}
    1 & 1 \\
    1 & 2 \\
    1 & 0 \\
    0 & 1
\end{bmatrix}

b = \begin{bmatrix}
    12 \\
    16 \\
    10 \\
    6
\end{bmatrix}
$$

The corresponding dual is:

$$\min \; b^T y$$

Subject to:

$$
A^T y \geq c
$$

$$
y \geq 0
$$

We obtain:

Variables:

- $$y_1$$ : dual variable for the land constraint
- $$y_2$$ : dual variable for the water constraint
- $$y_3$$ : dual variable for the tomato seeds constraint
- $$y_4$$ : dual variable for the potato seeds constraint

Objective function :

$$\min \; 12y_1 + 16y_2 + 10y_3 + 6y_4$$

Subject to:

$$
\begin{aligned}
    &y_1 + y_2 + y_3 \geq 3 &&\text{(Constraint for tomato variable)} \\
    &y_1 + 2y_2 + y_4 \geq 5 &&\text{(Constraint for potato variable)} \\
    &y_1, y_2, y_3, y_4  \geq 0 &&\text{(Non-negativity)}
\end{aligned}
$$

### Dual AMPL Code

We can write the AMPL code for the dual problem:

File: `farmer_dual.mod`

```ampl
# Variables
var y_1 >=0;
var y_2 >=0;
var y_3 >=0;
var y_4 >=0;

# Objective function
minimize cost: 12*y_1 + 16*y_2 + 10*y_3 + 6*y_4;

# Constraints
s.t. tomato_constraint: y_1 + y_2 + y_3 >= 3;
s.t. potato_constraint: y_1 + 2*y_2 + y_4 >= 5;
```

File: `farmer_dual.run`

```ampl
reset;

model farmer_dual.mod;
option solver gurobi;
solve;

display 
    y_1,
    y_2,
    y_3,
    y_4, 
    tomato_constraint.body,
    tomato_constraint.slack,
    tomato_constraint.dual,
    potato_constraint.body,
    potato_constraint.slack,
    potato_constraint.dual,
    cost;
```

AMPL output :

```bash
ampl: include "farmer_dual.run";
Gurobi 12.0.0: optimal solution; objective 44
3 simplex iterations
y_1 = 1
y_2 = 2
y_3 = 0
y_4 = 0
tomato_constraint.body = 3
tomato_constraint.slack = 0
tomato_constraint.dual = 8
potato_constraint.body = 5
potato_constraint.slack = 0
potato_constraint.dual = 4
cost = 44
```

We obtain:

- Dual optimal solution: $$(y_1, y_2, y_3, y_4) = (1, 2, 0, 0)$$
- Dual Objective: 44 (same as the primal's optimal value, strong duality).

## Primal-Dual Relationship

When AMPL solves the primal problem, it automatically computes the dual values. In the primal output, for instance:

- `land.dual = 1` corresponds to $$y_1 = 1$$.
- `water.dual = 2` corresponds to $$y_2 = 2$$.
- `tomato_seed.dual = 0` corresponds to $$y_3 = 0$$.
- `potato_seed.dual = 0` corresponds to $$y_4 = 0$$.

Similarly, when solving the dual, AMPL can display the dual of the dual problem, which actually corresponds to the primal variables:

- `tomato_constraint.dual = 8` corresponds to $$x_T = 8$$.
- `potato_constraint.dual = 4` corresponds to $$x_P = 4$$.

To better understand the values of the dual variables (shadow prices/dual prices), keep in mind that:

1. Each dual variable corresponds to a primal resource (or constraint):
    - $$y_1$$ corresponds to Land
    - $$y_2$$ corresponds to Water
    - $$y_3$$ corresponds to Tomato seeds
    - $$y_4$$ corresponds to Potato seeds

2. Its value indicates the marginal worth of that resource:  
   - If $$y_i > 0$$, it means the corresponding resource is fully utilized (the constraint is tight). Adding one more unit of that resource will increase the primal objective (the profit) by $$y_i$$ units.  
   - If $$y_i = 0$$, it means there is some slack in the corresponding resource, not all of it is used. Adding more of that resource will not increase the objective, so its marginal worth is zero.

   They help decision-makers identify which resources are the most critical or limiting in the optimization problem.

   In the [graphical representation](#graphical-representation) above, if you modify the constraint on the land from 12 to 16 (so 4\*1k€ = 4k€) and the water constraint from 16 to 22(so 6\*2k€ = 12k€), you will see that the optimal solution changes to (10, 6) with a profit from 44 to 60k€ (44 + 4 + 12).

3. Connecting primal and dual solutions (complementary slackness):  
   - If a primal constraint has a positive dual value ($$y_i > 0$$), that primal constraint is binding (slack = 0).
   - If a primal constraint is not binding (has some leftover resource), then the corresponding dual variable must be 0.

4. Example from the Farmer’s Problem solution:
   - $$y_1 = 1$$: The land resource is fully used (slack = 0). One more hectare of land would allow an increase of 1 k€ in the total profit.  
   - $$y_2 = 2$$: The water resource is also fully used. One more unit of (rescaled) water would allow an increase of 2 k€ in total profit—meaning water is twice as valuable (marginally) compared to land in this setup.  
   - $$y_3 = 0$$: The tomato seeds resource has slack (we are not using all of them). Hence adding more tomato seeds won’t help.  
   - $$y_4 = 0$$: The potato seeds resource also has slack, so it is not a limiting factor and has zero marginal worth.

In short, the dual variables tell you how much your objective (profit) would improve if you relaxed (increased) one of the limiting resources. If the dual price is zero, that resource is non-limiting. This is the key economic or operational interpretation behind dual variable values in linear programming.

## Interpreting Slack and Body

Slack in a constraint represents the unused portion of that resource.
Slack measures leftover capacity in each constraint.
Zero slack means you are at the limit of that resource.

- In the primal, `land.slack = 0` means that all 12 hectares of land are used.
- In the dual, the "slack" in tomato_constraint is how much bigger the left-hand side is compared to 3. When it’s zero, it indicates that constraint is exactly tight.

Body in AMPL typically shows the current value of the left-hand side of the constraint.

- In the primal, `land.body = 12` means the farmer is using all 12 hectares of land.
- In the primal, `tomato_seed.body = 8` means $$x_t = 8$$. That satisfies the constraint $$x_t \leq 10$$, hence the slack is $$10-8=2$$.

## Conclusion

Primal problem: Maximize profit by deciding how many hectares of tomatoes and potatoes to plant.

Dual problem: Minimizes the total cost of resources (land, water, tomato seeds, and potato seeds) required to "cover" the profit coefficients of tomatoes and potatoes.

By strong duality, the two problems have the same optimal objective value of 44k€ :

- Primal solution: $$(x_t, x_p) = (8, 4)$$.
- Dual solution: $$(y_1, y_2, y_3, y_4) = (1, 2, 0, 0)$$.

Strong Duality guarantees that the maximum profit in the primal problem equals the minimum resource cost in the dual problem.

<script src="https://www.geogebra.org/apps/deployggb.js"></script>

<script>
    var parameters = {
        "id": "ggbApplet",
        "width": 1033,
        "height": 561,
        "showMenuBar": false,
        "showAlgebraInput": false,
        "showToolBar": false,
        "customToolBar": "0 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
        "showToolBarHelp": false,
        "showResetIcon": false,
        "enableLabelDrags": false,
        "enableShiftDragZoom": false,
        "enableRightClick": false,
        "errorDialogsActive": false,
        "useBrowserForJS": false,
        "allowStyleBar": false,
        "preventFocus": false,
        "showZoomButtons": false,
        "capturingThreshold": 3,
        // add code here to run when the applet starts
        "appletOnLoad": function (api) { /* api.evalCommand('Segment((1,2),(3,4))');*/ },
        "showFullscreenButton": false,
        "scale": 1,
        "disableAutoScale": false,
        "allowUpscale": false,
        "clickToLoad": false,
        "appName": "classic",
        "buttonRounding": 0.7,
        "buttonShadows": false,
        "language": "fr",
        // use this instead of ggbBase64 to load a material from geogebra.org
        // "material_id":"RHYH3UQ8",
        // use this instead of ggbBase64 to load a .ggb file
        // "filename":"myfile.ggb",
"ggbBase64":"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",    };
    // is3D=is 3D applet using 3D view, AV=Algebra View, SV=Spreadsheet View, CV=CAS View, EV2=Graphics View 2, CP=Construction Protocol, PC=Probability Calculator DA=Data Analysis, FI=Function Inspector, macro=Macros
    var views = { 'is3D': 0, 'AV': 1, 'SV': 0, 'CV': 0, 'EV2': 0, 'CP': 0, 'PC': 0, 'DA': 0, 'FI': 0, 'macro': 0 };
    var applet = new GGBApplet(parameters, '5.0', views);
    window.onload = function () { applet.inject('ggbApplet') };
    applet.setPreviewImage('data:image/gif;base64,R0lGODlhAQABAAAAADs=', 'https://www.geogebra.org/images/GeoGebra_loading.png', 'https://www.geogebra.org/images/applet_play.png');
</script>
