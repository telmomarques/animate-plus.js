#![Animate-plus.js](http://telmo.pt/animate-plus.js/images/animatepluslogo.jpg)
`animate-plus.js` is a jQuery plugin that extends [animate.css](http://daneden.github.io/animate.css/) functionality. No javascript coding required!

- Do multiple animations, on multiple elements
- Do animations in order or at the same time
- Make elements animate while scrolling
- Group elements in independent animation groups

##Quick start

1. Include [jQuery](http://jquery.com/download) and [Animate.css](http://daneden.github.io/animate.css)
2. Add `animate-plus` css class to element
3. Define animations using the `data-animations` attribuite
4. Specify duration and delay using `data-animation-duration` and `data-animation-delay`

```html
<span
    class="animate-plus"
    data-animations="bounceIn,fadeOutRight"
    data-duration="1s,500ms"
    data-delay="0s, 2s"
>
    Animated content
</span>
```

See more examples [here](#examples).

For a full list of options see [Attributes](#attributes).

##Documentation
------------
###First things first
Begin by downloading and including [animate.css](http://daneden.github.io/animate.css/) and [jQuery](http://jquery.com/download/) in your HTML document.
Next, download and include `animate-plus.min.js`

```html
<link rel="stylesheet" href="path/to/animate.css" />
<script type="text/javascript" src="path/to/jQuery-x.x.x.js"></script>
<script type="text/javascript" src="path/to/animate-plus.min.js"></script>
```

Finally, add the `animate-plus` css class to any elements you want to animate.

```html
<span class="animate-plus">...</span>
```

###Attributes
Everything is specified using HTML5 `data-*` attributes. Attributes always start with `data-animation-*` except for `data-animations`. See a list of available attribuites below.

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attribute&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Description|
|---------|-----------|
|`data-animations`|List of comma delimited animation names. By default the animations are executed from left to rigth. Valid values are `animate.css` [class names](http://daneden.github.io/animate.css/). This is the only **required attribute**.|
|`data-animation-group`|Name of the animation group. You can group animated elements using this attribute. Please refrain from using names that begin with an underscore (_), that's reserved for internal use.|
|`data-animation-order`|List of comma delimited `integer` values. You can override the order of animation inside a group using the attribute.|
|`data-animation-duration`|List of comma delimited duration values. This attribute will set the duration for the specified animations. For valid values see `animation-duration` [css property](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration).|
|`data-animation-delay`|List of comma delimited delay values. This attribute will set how many time to wait before executing the animations. For valid values see `animation-delay` [css property](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay).|
|`data-animation-when-visible`|Animate group only when visible on screen (binds on scroll and resize). This will begin animation as soon as one group element is visible. Valid value is `true`.|
|`data-animation-reset-offscreen`|Reset animation when group goes off screen. The group will be reseted as soon as one group element goes off screen. This attribute only has effect when used together with `data-animation-when-visible`. Valid value is `true`. |
|`data-animation-repeat`|Loop animation group indefinitely. Valid value is `true`.|

##Examples
------------

[See live examples here.](http://telmo.pt/animate-plus.js/#liveExamples)

1. One element with multiple animations. The animations will execute one at a time, from left to right, using default duration and delay.

    ```html
    <span class="animate-plus" data-animations="bounceIn,shake,fadeOutRight,fadeIn">...</span>
    ```
2. One element looping indefinitely.

    ```html
    <span class="animate-plus" data-animations="bounceIn, fadeOutLeft" data-animation-repeat="true">...</span>
    ```

3. Group of 2 elements, animated in a specified order. Animations will go as follows:
    + bounceIn
    + tada
    + fadeOutLeft and fadeOutRight at the same time

    ```html
    <span
        class="animate-plus"
        data-animation-group="group1"
        data-animations="bounceIn, fadeOutLeft"
        data-animation-order="1,3"
    >
        ...
    </span>
    
    <span
        class="animate-plus"
        data-animation-group="group1"
        data-animations="tada, fadeOutRight"
        data-animation-order="2,3"
    >
        ...
    </span>
    ```
4. Group of 2 elements, animated with specified duration and delay. Both elements will start animating at the same time (except when delay is specified), always waiting for the previous animation in the group to finish.

    ```html
    <span
        class="animate-plus"
        data-animation-group="group2"
        data-animations="bounceIn, fadeOutLeft"
        data-animation-duration="3s,5s"
    >
        ...
    </span>
    
    <span
        class="animate-plus"
        data-animation-group="group2"
        data-animations="tada, fadeOutRight"
        data-animation-delay="0s,2s"
    >
        ...
    </span>
    ```
5. One element that animates when it's visible on screen (ex. on scroll). The animation resets when the element goes off screen.

    ```html
    <span
        class="animate-plus"
        data-animations="tada"
        data-animation-when-visible="true"
        data-animation-reset-offscreen="true"
    >
        ...
    </span>
    ```
    
##License
Animate-plus.js is licensed under the MIT License. Please see `LICENSE.txt` file distributed with this software.
