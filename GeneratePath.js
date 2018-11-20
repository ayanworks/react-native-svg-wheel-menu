import React, { Component } from 'react';
import { ART, Easing, Animated } from 'react-native';
const { Surface, Group, Rectangle, Shape } = ART;
import Svg, { Circle, G, Text, Path, Line, Use } from 'react-native-svg';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text),
}

import * as shape from 'd3-shape';
import * as d3 from 'd3';

const path = d3.arc().outerRadius(80).padAngle(0.02).innerRadius(33);

export default class GeneratePath extends Component {

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
      useNativeDriver: true
    })
    ])
    ]).start();
  }

  render() {
     const anim = { transform: [{translateX: this.state.scaleX}] }
    return (
      <Animatee.Path
             opacity={this.state.fillColor.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            })}
             key={this.props.key}
             d={this.props.d}
             strokeWidth={1} />
    );
  }
}