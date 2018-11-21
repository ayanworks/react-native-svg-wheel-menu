import React, { Component } from 'react';
import { Platform, StyleSheet, View, ART, Easing, ImageBackground, Animated, BackHandler } from 'react-native';
const { Surface, Group, Rectangle, Shape } = ART;
import Svg, { Circle, G, Text, Path, Line, Use } from 'react-native-svg';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text),
}

import * as shape from 'd3-shape';
import * as d3 from 'd3';

const path = d3.arc().outerRadius(80).padAngle(0.02).innerRadius(32);

export default class GenerateArcText extends Component {

  constructor(props) {
    super(props);
    this.state= {
      fillColor: new Animated.Value(0),
      scaleX: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.executeMe();
  }

  executeMe() {
    Animated.parallel([
    Animated.timing(this.state.fillColor, {
      toValue: 1,
      duration: 150,
      delay: 100 + 100 * this.props.idx,
      useNativeDriver: true
    }),
    Animated.sequence([
      Animated.timing(this.state.scaleX, {
      toValue: 1,
      duration: 150,
      delay: 100 + 100 * this.props.idx,
      useNativeDriver: true
    }),
    Animated.timing(this.state.scaleX, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    })
    ])
    ]).start();
  }

  truncate(string) {
    if(this.props.semi) {
      if (string.length > 8) return string.substring(0, 5) + '...';
      else return string;  
    }
    else {
      if (string.length > 12) return string.substring(0, 8) + '...';
      else return string;
    }
  }

  render() {
     const anim = { transform: [{translateX: this.state.scaleX}] }
    return (
      <Animatee.Text
            opacity={this.state.fillColor.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            })}
          fontSize="9"
          fill= "black"
          x={path.centroid(this.props.section)[0]}
          y={path.centroid(this.props.section)[1]}
          textAnchor="middle">
          {this.truncate(this.props.section.data.itemName)}
        </Animatee.Text>
    );
  }
}