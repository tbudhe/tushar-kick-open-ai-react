# Decision Tree Algorithm

## Overview

A **Decision Tree** is a popular supervised learning algorithm used for both **classification** and **regression** tasks. It works by recursively partitioning the dataset based on feature values to create a tree-like model of decisions.

## How It Works

Decision trees make predictions by asking a series of yes/no questions about the features in your data. At each node, the algorithm selects the feature and threshold that best splits the data into groups.

### Key Concepts

**1. Root Node**
- The starting point of the decision tree
- Contains the entire dataset
- First split is based on the most important feature

**2. Internal Nodes**
- Decision points that split data based on feature values
- Each internal node evaluates a condition (e.g., "Is age > 30?")

**3. Leaf Nodes (Terminal Nodes)**
- Final decision points where predictions are made
- Represent the predicted class or value

**4. Branches**
- Paths connecting nodes based on condition outcomes (True/False)

## Splitting Criteria

Decision trees use impurity measures to determine the best splits:

### Entropy (Information Gain)
Entropy measures the disorder or unpredictability in a dataset.

**Formula:**
```
Entropy = -Σ(p_i * log2(p_i))
```
where p_i is the proportion of class i in the dataset.

**Information Gain:**
```
Information Gain = Entropy(parent) - Weighted Average Entropy(children)
```

The algorithm selects splits that maximize **Information Gain** (highest entropy reduction).

**Use Case:** Primarily used in **ID3, C4.5, and C5.0** algorithms

*Image: entropy-decision-tree.png* - Shows how entropy decreases as data becomes more homogeneous (pure).

### Gini Index (Gini Impurity)
Gini Index measures the probability of incorrectly classifying a randomly selected element.

**Formula:**
```
Gini = 1 - Σ(p_i)²
```
where p_i is the proportion of class i in the dataset.

**Gini Index Range:**
- **0**: Pure node (all samples belong to one class)
- **1**: Completely mixed node (equal distribution of classes)

The algorithm selects splits that minimize **Gini Index** (create purest children).

**Use Case:** Primarily used in **CART (Classification and Regression Trees)** algorithm

*Image: gini-index-decision-tree.png* - Shows how Gini index decreases as classes become more separated.

## Advantages

✓ **Easy to understand and interpret** - Results can be visualized as a flowchart
✓ **Minimal data preprocessing** - No need for feature scaling or normalization
✓ **Handles both numerical and categorical data** - Works with mixed data types
✓ **Non-parametric** - Makes no assumptions about data distribution
✓ **Feature importance** - Automatically ranks feature importance
✓ **Fast predictions** - Once trained, predictions are very quick
✓ **No need for domain expertise** - Can learn patterns automatically

## Disadvantages

✗ **Prone to overfitting** - Trees can memorize training data noise
✗ **Unstable** - Small changes in data can result in completely different trees
✗ **Biased toward high-cardinality features** - Prefers features with many distinct values
✗ **Greedy algorithm** - Uses local optimization (may miss global optimal tree)
✗ **Performs poorly with linear relationships** - Better with non-linear patterns
✗ **Can become very deep** - Large trees are hard to interpret
✗ **Imbalanced data issues** - Biased toward majority classes

## Common Algorithms

### ID3 (Iterative Dichotomiser 3)
- Uses **Entropy and Information Gain**
- Only handles categorical features
- Prone to overfitting

### C4.5
- Improved version of ID3
- Handles both categorical and numerical features
- Uses **Gain Ratio** (normalizes information gain)
- Includes pruning to prevent overfitting

### CART (Classification and Regression Trees)
- Uses **Gini Index** for splitting
- Handles both classification and regression
- Produces binary trees (each node has exactly 2 children)
- Includes cost-complexity pruning

### C5.0
- Latest improvement of C4.5
- Faster and more memory efficient
- Better handling of imbalanced datasets
- Can use boosting for ensemble methods

## Parameters to Tune

| Parameter | Impact | Value Range |
|-----------|--------|-------------|
| **max_depth** | Tree complexity, overfitting control | 1 - 50+ |
| **min_samples_split** | Minimum samples to create internal node | 2 - 100+ |
| **min_samples_leaf** | Minimum samples in leaf node | 1 - 100+ |
| **criterion** | Splitting metric (entropy or gini) | 'entropy', 'gini' |
| **splitter** | Feature splitting strategy | 'best', 'random' |
| **max_features** | Number of features to consider | sqrt, log2, all |

## Example: Email Classification

```
Decision Tree for Spam Email Detection

                      All Emails (1000)
                            |
                    [Sender in Whitelist?]
                       /           \
                     Yes             No
                    /                 \
              Legitimate         [Contains Keywords?]
              (850 samples)          /          \
                                  Yes            No
                                 /                \
                            Spam              [Suspicious Domain?]
                         (80 samples)         /             \
                                           Yes               No
                                          /                   \
                                       Spam            Legitimate
                                   (50 samples)       (20 samples)
```

## When to Use Decision Trees

✓ **Classification problems** - Email filtering, customer segmentation
✓ **Regression problems** - Price prediction, value estimation
✓ **Feature selection** - Identify important features
✓ **Non-linear relationships** - Complex patterns
✓ **Interpretability crucial** - Medical diagnosis, loan approval
✓ **Mixed data types** - Categorical and numerical features

## Python Implementation Example

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Create and train decision tree
dt = DecisionTreeClassifier(
    criterion='gini',          # 'entropy' for information gain
    max_depth=5,               # Prevent overfitting
    min_samples_split=2,
    min_samples_leaf=1
)
dt.fit(X_train, y_train)

# Make predictions
predictions = dt.predict(X_test)
accuracy = dt.score(X_test, y_test)

# Feature importance
print(dt.feature_importances_)

# Visualize tree
from sklearn import tree
tree.plot_tree(dt, feature_names=iris.feature_names, filled=True)
```

## Further Reading

- [Scikit-learn Decision Tree Documentation](https://scikit-learn.org/stable/modules/tree.html)
- [Information Gain and Entropy](https://en.wikipedia.org/wiki/Information_gain_(decision_tree))
- [Gini Index Explanation](https://en.wikipedia.org/wiki/Gini_impurity)
- [Decision Tree Pruning Techniques](https://www.section.io/blog/decision-trees-in-machine-learning/)

---

**Last Updated:** February 2026
