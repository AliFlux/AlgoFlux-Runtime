# [AlgoFlux](http://algoflux.com) Runtime
#### Empower your web applications with robust algorithms.

## Introduction

AlgoFlux Runtime is a javascript library that deals with data-structures, processing and algorithms. This library comes built-in with [AlgoFlux IDE](http://algoflux.com) but it can be certainly used as a stand-alone script.

This library is composed of:

### Helper Modules

AlgoFlux Runtime provides the following static modules:

1. Matrix related methods ([MatrixH](http://docs.algoflux.com/api/module-MatrixH.html)).
2. Mathematical functions ([MathH](http://docs.algoflux.com/api/module-MathH.html)).
3. Object related functions ([ObjectH](http://docs.algoflux.com/api/module-ObjectH.html)).
4. Array related functions ([ArrayH](http://docs.algoflux.com/api/module-ArrayH.html)).
5. Colors manipulation ([ColorH](http://docs.algoflux.com/api/module-ColorH.html)).
6. Miscellaneous helper functions ([Helpers](http://docs.algoflux.com/api/module-Helpers.html)).

### Data-structure Classes

These classes are instantiable and are used for custom data-manipulation.

1. Graph creation and manipulation ([Graph](http://docs.algoflux.com/api/Graph.html)).
2. Maze creation and functions ([Maze](http://docs.algoflux.com/api/Maze.html)).
3. Linked-list creation and operations ([LinkedList](http://docs.algoflux.com/api/LinkedList.html)).
4. Queue creation and operations ([Queue](http://docs.algoflux.com/api/Queue.html)).
5. Stack creation and operations ([Stack](http://docs.algoflux.com/api/Stack.html)).


## Design goals

- Tiny size
- Zero dependencies (just jQuery for now)
- Object-oriented usage
- Works on both browsers and servers
- Easy to use
- No prototyping of built-in classes.

## Installation

Just copy the [algoflux.runtime.min.js](algoflux.runtime.min.js) into your working path, and include this script to your `<head>` tag.

## API Reference

Please find the complete API reference at the [AlgoFlux](http://docs.algoflux.com/api/documentation) site.

##### Note

> The runtime does not come with a UI for data display. For UI controls, please use the [AlgoFlux IDE](http://algoflux.com).

## Examples

Following examples can be viewed and executed online. They make use of the runtime.

- Breadth-first traversal (Using Graph).
- A* path-finding (Using Maze).
- K-Means clustering (Using Scatter plot).
- Automated vaccum cleaner.
- News classification algorithm.
- Natural Language Processing.

## Contributing

Please submit bug reports, suggestions and pull requests to the [GitHub issue tracker](https://github.com/AliFlux/AlgoFlux-Runtime/issues).
We are looking forward to expand its functionality by adding more useful data-structures.

## License

This software is released under the [MIT License](LICENSE). Please read LICENSE for information on the
software availability and distribution.