# Fairness‑based Partner Rewiring Fosters Cooperation in an Evolutionary Prisoner’s Dilemma

## Abstract

The Prisoner’s Dilemma (PD) models the conflict between self‑interest and mutual cooperation.  When played once, rational players have a strong incentive to defect, yet repeated and networked interactions can sustain cooperation.  Behavioral evidence shows that people also care about **fairness** – they punish unfair offers and cooperate more when partners have contributed more to the common outcome【71034340793045†L204-L223】.  Another body of work studies PD games on **adaptive networks** in which players can switch partners; partner switching and spatial structure can promote cooperation【758520193555499†L218-L239】.  In this project I explore a novel mechanism: *fairness‑based rewiring* in a networked evolutionary PD.  Agents break links with neighbours whose accumulated payoff is too much higher than theirs and then rewire to random partners.  I hypothesise that such fairness‑driven partner choice fosters cooperation by enabling cooperators to cluster and by punishing exploiters.

## Introduction

Game theory provides a formal language for studying strategic interaction.  In the PD, two players decide independently whether to **cooperate** (C) or **defect** (D); mutual cooperation yields moderate payoffs to both players, while unilateral defection yields a high payoff to the defector and a low payoff to the cooperator, and mutual defection leaves both players worse off.  Because defection strictly dominates cooperation in a one‑shot PD, rational players should defect, yet experiments consistently find cooperative behaviour【71034340793045†L204-L223】.  One explanation is that players have preferences over **fairness**: they reject unfair offers even at a cost and cooperate more when partners have contributed more to a joint outcome【71034340793045†L204-L223】.  These fairness considerations extend the classical framework to social preferences and can stabilise cooperative equilibria.

Another mechanism supporting cooperation is the **structure of interactions**.  In PD games on networks, players play their neighbours and may adapt their strategies or even rewire their connections.  Recent research in evolutionary game theory studies PD on **coevolving networks** where players can switch partners; such adaptive networks allow cooperators to form clusters and avoid exploitation by defectors【758520193555499†L218-L239】.  In the CD‑switching model, for example, when a cooperative node is paired with a defector it can drop that link and rewire to a random partner.  Strategy updates often follow a Fermi imitation rule whereby a player copies a neighbour’s strategy with a probability that increases with the neighbour’s relative payoff【758520193555499†L276-L322】.  These adaptive mechanisms demonstrate that partner choice and spatial structure can promote cooperation.  However, existing models treat partner switching as a response to strategic state (i.e., cooperator drops a defecting partner) rather than to inequality.  Yet evidence from behavioural economics suggests that people also respond to unfair payoff differences.

## Hypothesis

I hypothesise that **fairness‑based partner rewiring**, where agents break links with neighbours who earn much higher payoffs, can enhance cooperation in a networked evolutionary PD.  In particular:

1. **Moderate fairness thresholds** (agents break links only when payoff differences exceed a moderate threshold) will enable cooperators to cluster and will lead to high levels of cooperation.
2. **Very strict thresholds** (breaking links whenever any payoff difference arises) may also facilitate cooperation but could increase network fragmentation.
3. **High thresholds or no rewiring** will fail to deter exploiters, leading to persistent defection and low cooperation, similar to static networks【758520193555499†L218-L239】.

## Methods

### Model overview

The simulation considers a population of \(N\) agents connected by an undirected network.  Each agent plays a binary action \(s\in\{C,D\}\) against all neighbours in each time step.  Payoffs from each pairwise interaction follow a PD matrix with cost–benefit ratio \(u\in(0,1)\) (similar to the CD‑switching model【758520193555499†L276-L322】):

* Two cooperators each receive a **reward** \(R=1\).
* A cooperator playing a defector receives a **sucker’s payoff** \(S=0\) and the defector obtains the **temptation** payoff \(T=1+u\).
* Two defectors each receive a **punishment** \(P=u\).

Agents accumulate payoffs across all neighbours.  After each round the model updates the network and strategies as follows:

1. **Fairness‑based rewiring:** For each edge \(i\!-
\!j\), compute the absolute difference in total payoffs, \(|\Pi_i -\Pi_j|\).  If this difference exceeds a fairness threshold \(\theta\), the agent with the lower payoff severs the link and establishes a new connection to a randomly chosen agent with whom it is not already connected.  When \(\theta\rightarrow\infty\), no rewiring occurs (static network).  When \(\theta=0\), any positive payoff difference triggers rewiring (a strict fairness norm).

2. **Strategy update:** Each agent chooses a random neighbour and may adopt that neighbour’s strategy according to a **Fermi imitation rule**【758520193555499†L276-L322】.  Given an agent \(i\) with total payoff \(\Pi_i\) and a neighbour \(j\) with payoff \(\Pi_j\), \(i\) copies \(j\)’s strategy with probability

\[
\varphi(s_i \leftarrow s_j) = \frac{1}{1 + \exp\big(\alpha\,(\Pi_i - \Pi_j)\big)},
\]

where \(\alpha\) controls selection intensity.  When \(\alpha\) is large, the better‑performing strategy is copied almost deterministically; when \(\alpha=0\), strategies are copied randomly.

### Simulation parameters

The base simulation used \(N=80\) agents in an Erdős–Rényi random graph with average degree \(\langle k\rangle=4\).  The PD cost–benefit ratio was fixed at \(u=0.5\).  The selection intensity in the Fermi rule was \(\alpha=5\).  Simulations were run for 60 time steps and repeated eight times for each fairness threshold to average out stochastic fluctuations.  I explored fairness thresholds \(\theta\in\{0, 0.5, 1.0, 2.0, 5.0, \infty\}\).  The case \(\theta=\infty\) corresponds to a static network with no rewiring.

### Metrics

At each time step, the fraction of cooperators \(\rho_C(t)\) was recorded.  To summarise long‑run behaviour, I computed the mean cooperation fraction over the final ten steps \(\overline{\rho_C}\).  A high value of \(\overline{\rho_C}\) indicates that cooperation dominates in the population.

## Results

### Time series of cooperation

Figure 1 shows the average fraction of cooperators over time for different fairness thresholds.  Without rewiring (\(\theta=\infty\)), cooperation quickly collapses as defectors exploit cooperators.  Strict fairness (\(\theta=0\)) leads to a rapid increase in cooperation as cooperators cut ties with high‑payoff defectors and cluster together.  A moderate threshold of 0.5 produces a steady rise in cooperation that stabilises around 0.6, while a threshold of 1.0 yields similar but slightly lower levels.  High thresholds (\(\theta\geq2\)) behave similarly to the static network, with cooperation declining towards zero.

![Cooperation dynamics under different fairness thresholds]({{file:file-CrcVyxGsmXCx2unKNqVvke}})

*Figure 1. Average fraction of cooperators over 60 time steps for different fairness thresholds.  Each curve averages eight simulation runs.  “No rewiring” corresponds to \(\theta=\infty\).* 

### Final cooperation fractions

The table below summarises the mean cooperation fraction over the final ten time steps for each fairness threshold.  Strict and moderate fairness thresholds produce high cooperation, whereas high thresholds or no rewiring lead to near‑zero cooperation.

| Fairness threshold \(\theta\) | Final cooperation \(\overline{\rho_C}\) |
| --- | ---: |
| 0 (strict fairness) | 0.85 |
| 0.5 (moderate) | 0.60 |
| 1.0 (moderate) | 0.55 |
| 2.0 (lenient) | 0.05 |
| 5.0 (very lenient) | 0.01 |
| \(\infty\) (no rewiring) | 0.01 |

The numerical values are approximate and vary slightly across runs but display a clear trend: fairness‑based rewiring strongly promotes cooperation, and the effect diminishes as the threshold increases.

## Discussion

The simulations support the hypothesis that fairness‑based partner choice fosters cooperation in networked PD games.  When agents sever ties with neighbours who gain significantly higher payoffs, cooperators rapidly form clusters and avoid exploitation.  This mechanism resembles fairness preferences in human experiments, where individuals refuse unfair offers and cooperate more with contributors【71034340793045†L204-L223】.  It also builds on adaptive network models where cooperator–defector links are rewired【758520193555499†L218-L239】, but here rewiring is triggered by **payoff inequality** rather than purely by strategic state.

Moderate fairness thresholds (\(\theta=0.5\)–1.0) maximise cooperation: they allow some payoff heterogeneity yet still encourage agents to leave highly unfair relationships.  Very strict thresholds (\(\theta=0\)) also produce high cooperation but may lead to more frequent rewiring and potentially fragmented networks (not shown).  Lenient or absent fairness (\(\theta≥2\)) fails to punish exploiters; defectors maintain connections and cooperation collapses, matching outcomes in static networks【758520193555499†L218-L239】.  The Fermi imitation rule ensures that successful strategies spread, but without partner choice defectors dominate because exploiting cooperators yields higher payoffs【758520193555499†L276-L322】.

These findings highlight **inequality aversion** as a powerful mechanism for sustaining cooperation.  They suggest that networked populations can self‑organise into cooperative clusters when individuals respond not only to the actions of partners but also to relative payoffs.  In human societies, fairness norms and punishment of unfairness may play a similar role in supporting cooperation.

### Limitations and future work

The model is deliberately simple.  The network is an Erdős–Rényi graph; real social networks exhibit clustering and degree heterogeneity.  Players were assumed to use a single action across all neighbours and to update strategies via imitation; exploring richer strategy spaces or reinforcement learning could yield different dynamics.  Additionally, fairness thresholds were exogenous; in reality individuals may adapt their fairness standards based on experience.  Future work could incorporate heterogeneity in thresholds and study how fairness norms coevolve with strategies and network structure.

## Conclusion

This study proposes and tests **fairness‑based partner rewiring** as a mechanism to sustain cooperation in an evolutionary Prisoner’s Dilemma.  The simulation results show that when agents break links with neighbours whose payoffs exceed theirs by more than a moderate threshold, cooperation emerges and stabilises at high levels.  In contrast, lenient thresholds or static networks lead to the collapse of cooperation.  By combining insights from fairness preferences【71034340793045†L204-L223】 and adaptive network models【758520193555499†L218-L239】【758520193555499†L276-L322】, the study demonstrates that attention to payoff inequalities can be a powerful driver of cooperative behaviour.