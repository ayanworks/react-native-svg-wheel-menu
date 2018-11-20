import React, { Component } from 'react';
import { Platform, StyleSheet, View, ART, Animated, Easing, ImageBackground, BackHandler } from 'react-native';
import { Text as Textual } from 'react-native';
const { Surface, Group, Rectangle, Shape } = ART;
import Svg, { Circle, G, Text, Path, Line, Use } from 'react-native-svg';
import { Container, Content, StyleProvider, Header, Icon, Toast } from 'native-base';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text),
}
import GenerateArcText from './GenerateText';
import GeneratePath from './GeneratePath';

const width = 400;
const height = 400;

const pieWidth = 150;

import * as shape from 'd3-shape';
import * as d3 from 'd3';

const path = d3.arc().outerRadius(80).padAngle(0.02).innerRadius(32);


class GeneratePathCanvas extends Component {
	constructor() {
		super();
		this.state = {
			animation: new Animated.Value(100),
			parent: [],
			parentAngles: [],
			child: [],
			colorBoolean: false,
			parentNode: [],
			helperColor: [],
			childAngles: [],
			colorStack: [],
			level2ChildAngles: [],
			nameOfChild: '',
			nameOfChildLevel2: '',
			depth: 0
		};
		this.spinValue = new Animated.Value(0);

		this.arc = d3.arc();
	}

	componentWillMount() {
		//  6
		const tempArray = [];
		this.props.userPurchases.map((item) => {
			if (item.parent === '0.0') {
				tempArray.push(item);
			}
		});

		const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
		//  for home
		this.setState({ parentAngles: sectionAngles });
		// alert(JSON.stringify(this.state.parentAngles));
	}

	clickOnChildTitle() {
		const tempArray = [];
		this.setState({ childAngles: [] });
	}

	clickOnLevel2ChildTitle() {
		const tempArray = [];
		this.setState({ level2ChildAngles: [], depth: 2});
	}

	clickOnChildItem(data, name, idx) {
		if(this.state.depth === this.props.depth) {
			this.props.clickEvent(data, name);
		}

		else {

		this.setState({ nameOfChildLevel2: name});
		const tempArray = [];
		this.props.userPurchases.map((item) => {
			if (item.parent === data.id) {
				tempArray.push(item);
			}
			else {
				Toast.show({
					text: 'We are working on it & will be back soon!',
					buttonText: 'okay'
				});
			}
		});

		if(tempArray.length>0) {
			this.setState({ depth: 3 });
		}
		this.pushMeToStackLevel2(data, tempArray.length, idx);
		const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
		this.setState({ level2ChildAngles: sectionAngles });

		}
	}

	onSecondParentClick(data, name) {
		this.setState({ nameOfChildLevel2: name });
		const tempArray = [];
		this.props.userPurchases.map((item) => {
			if (item.parent === data.id) {
				tempArray.push(item);
			}
		});

		const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
		this.setState({ level2ChildAngles: sectionAngles });
	}

	returnColorBrightness(rgbcode) {
		var r = parseInt(rgbcode.slice(1, 3), 16),
        g = parseInt(rgbcode.slice(3, 5), 16),
        b = parseInt(rgbcode.slice(5, 7), 16),
        HSL = this.rgbToHsl(r, g, b),
        RGB;
        return (HSL[2] * 100);
	}

	colorLuminance(rgbcode, brightness) {
		
		 var r = parseInt(rgbcode.slice(1, 3), 16),
        g = parseInt(rgbcode.slice(3, 5), 16),
        b = parseInt(rgbcode.slice(5, 7), 16),
        HSL = this.rgbToHsl(r, g, b),
        RGB;
        
	    RGB = this.hslToRgb(HSL[0], HSL[1], brightness / 100);
	    rgbcode = '#'
	        + this.convertToTwoDigitHexCodeFromDecimal(RGB[0])
	        + this.convertToTwoDigitHexCodeFromDecimal(RGB[1])
	        + this.convertToTwoDigitHexCodeFromDecimal(RGB[2]);
    
	    return rgbcode;

	}

	convertToTwoDigitHexCodeFromDecimal(decimal){
    var code = Math.round(decimal).toString(16);
    
    (code.length > 1) || (code = '0' + code);
    return code;
}

	rgbToHsl(r, g, b){
	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min){
	        h = s = 0;
	    }else{
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }

	    return [h, s, l];
}

	hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l;
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = this.hue2rgb(p, q, h + 1/3);
        g = this.hue2rgb(p, q, h);
        b = this.hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

	hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
    }

	componentDidMount() {
		let point = this.state.parentAngles.length;
		let pointer = this.props.pieColorArray.length;
		if(point > pointer) {
			let _l = point - pointer
			this.setState({
				colorBoolean: true
			});
			const helperColor = []
			for(i=0;i<_l;i++) {
				helperColor.push(this.props.pieColorArray[0])
			}
			for(i=0;i<pointer;i++) {
				helperColor.push(this.props.pieColorArray[i])
			}
			this.setState({
				helperColor: helperColor
			});
		}
	}

	onParentClick(data, name, idx) {
		this.setState({ nameOfChild: name, depth: 2});
		const tempArray = [];
		this.props.userPurchases.map((item) => {
			if (item.parent === data.id) {
				tempArray.push(item);
			}
		});

		this.pushMeToStack(data, tempArray.length, idx);

		const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
		this.setState({ childAngles: sectionAngles });
	}

	pushMeToStackLevel2(getter, trackerLength, idx) {
		let len = getter.length;
		let myColors = '';
		var finCol = [];
	
		myColors = this.state.colorStack[idx];
		finCol.push(myColors);
		const brgns = Math.floor(this.returnColorBrightness(finCol[0]));

		const z = [];
		for (i = 0, temp = brgns; i <= trackerLength; i++ , temp = temp + 5) {
			z.push(temp);
		}
		var res;

		for (i=0;i<z.length;i++) {
			res = this.colorLuminance(myColors, z[i]);
			finCol.push(res);
		}
		for(i=0;i<finCol.length;i++) {
			if(finCol[i] === '#ffffff' && finCol[i-1] != '#ffffff')
			finCol[i] = finCol[i-1]
		}
		this.setState({ colorStack2: finCol });
	}

	pushMeToStack(getter, trackerLength, idx) {
		let len = getter.length;
		let myColors = '';
		var finCol = [];
	
		if(this.state.colorBoolean) {
			myColors = this.state.helperColor[idx];
			finCol.push(this.state.helperColor[idx]);
		}
		else { 
			myColors = this.props.pieColorArray[idx];
			finCol.push(this.props.pieColorArray[idx]);
		}
		const brgns = Math.floor(this.returnColorBrightness(finCol[0]));

		const z = [];
		for (i = 0, temp = brgns; i <= trackerLength; i++ , temp = temp + 6) {
			z.push(temp);
		}
		var res;

		for (i=0;i<z.length;i++) {
			res = this.colorLuminance(myColors, z[i]);
			finCol.push(res);
		}
		for(i=0;i<finCol.length;i++) {
			if(finCol[i] === '#ffffff' && finCol[i-1] != '#ffffff')
			finCol[i] = finCol[i-1]
		}
		this.setState({ colorStack: finCol });
	}

	truncate(string) {
		if (string.length > 12) return string.substring(0, 8) + '...';
		else return string;
	}

	render() {
		return (<View>
			{this.state.childAngles.length == 0 && this.state.level2ChildAngles.length == 0 ? (
			<Svg viewBox="-100 -100 200 200" width={width} height={height}>
					<G width={width / 2} height={height / 2}>
						<Circle cx="0" cy="0" r="30" fill="#eedfcc" />
						<Text fontSize="8" x={0} y={4} textAnchor="middle">
							{this.props.homeTitle}
						</Text>
						{this.state.parentAngles.map((section, idx) => (
              
              <Animatee.G
              fill= {this.state.colorBoolean ? this.state.helperColor[idx] : this.props.pieColorArray[idx]}
              onPress= {()=> this.onParentClick(section.data, section.data.itemName, idx)}
              >

              <GeneratePath
			  idx= {idx}
              section= {section}
              key= {idx}
              d= {path(section)}
              />

              <GenerateArcText 
              section= {section}
              idx= {idx}
              />
            </Animatee.G>
              
       	  ))}
				</G>
		</Svg>):null}
		{this.state.childAngles.length > 1 && this.state.level2ChildAngles.length == 0 ? (
			<Svg viewBox="-100 -100 200 200" width={width} height={height}>
					<G width={width / 2} height={height / 2}>
						<Circle cx="0" cy="0" r="30" fill={this.state.colorStack[0]}
						onPress={() => this.clickOnChildTitle()}
						 />
						<Text fontSize="8" x={0} y={4} textAnchor="middle">
							{this.truncate(this.state.nameOfChild)}
						</Text>

						{this.state.childAngles.map((section, idx) => (
              
              <Animatee.G
              fill={this.state.colorStack[idx+2]}
              onPress={() => this.clickOnChildItem(section.data, section.data.itemName, idx)}
              >

              <GeneratePath 
              idx= {idx}
              section= {section}
              key= {idx}
              d= {path(section)}
              />

              <GenerateArcText 
              section= {section}
              idx= {idx}
              />
            </Animatee.G>
              
       	  ))}
			</G>
		</Svg>):null}


	{this.state.level2ChildAngles.length > 1 ? (
		         <Svg
		            viewBox = "-100 -100 200 200"
		             width={width}
		             height={height}>
		            <G width = {width/2} height={height/2}>
		              < Circle
		               cx = "0"
		               cy = "0"
		               onPress={()=> this.clickOnLevel2ChildTitle()}
		               r = "30"
		               fill = {this.state.colorStack2[0]} />
		                <Text
		                  onPress={()=> this.clickOnLevel2ChildTitle()}
		                  fill="black"
		                  fontSize="8"
		                  x={0}
		                  y={4}
		                  textAnchor = "middle">{this.state.nameOfChildLevel2}</Text>
		               { this.state.level2ChildAngles.map((section, idx) => (
		                                   <Animatee.G
									              fill={this.state.colorStack2[idx+2]}
									              onPress={() => this.clickOnChildItem(section.data, section.data.itemName, idx)}
									              >

									              <GeneratePath 
									              idx= {idx}
									              section= {section}
									              key= {idx}
									              d= {path(section)}
									              />

									              <GenerateArcText 
									              section= {section}
									              idx= {idx}
									              />
								            </Animatee.G>
		                                 ))}
                             </G>
		         </Svg>): null}
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	welcome: {
		fontSize: 15,
		textAlign: 'center',
		margin: 10
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5
	},
	adv: {
		width: '100%'
	}
});

export default GeneratePathCanvas;