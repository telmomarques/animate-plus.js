/*
 * Animate-plus.js
 * Version 0.1
 * A jQuery plugin that extends animate.css (http://daneden.github.io/animate.css/) functionality.
 * 
 * Author: Telmo Marques
 * Email: me@telmo.pt
 * Twitter: @_TelmoMarques
 */
(function($)
{
    /**
     * Force an element to redraw
     * Author: Matt Tortolani
     * Source: http://forrst.com/posts/jQuery_redraw-BGv
     */
    jQuery.fn.redraw = function()
    {
        return this.hide(0, function(){$(this).show();});
    };

    /**
     * Restart a group's animation
     */
    jQuery.fn.restartAnimation = function()
    {
        var groupName = $(this).attr("data-animation-group");
        var group = AnimatePlus.getInstance().getMap()[groupName];
        group.restart();
    };

    /**
     * Defines an HTML element that will be animated
     * @param htmlElement Reference to an html element
     */
    function Element(htmlElement)
    {
        /*
         * Constructor
         */
        //Original html element
        this.htmlElement = htmlElement;
        //List of animations to apply to this element
        this.animations = $(this.htmlElement).attr("data-animations").split(",");
        //Keeps animation index (in practice this.animations[this.animationIndex]);
        this.animationIndex = 0;
        //Keeps last performed animation (animate.css class name)
        this.lastAnimation = "";
        
        //Check if this element defines animation durations
        if($(this.htmlElement).attr("data-animation-duration") !== undefined)
        {
            //Get the values
            this.animationDuration = $(this.htmlElement).attr("data-animation-duration").split(",");
        }
        
        //Check if this element defines animation delays
        if($(this.htmlElement).attr("data-animation-delay") !== undefined)
        {
            //Get the values
            this.animationDelay = $(this.htmlElement).attr("data-animation-delay").split(",");
        }
    };

    /*
     * Performs the next animation on the element
     * @param {function} callback Function to be called once the animation is complete
     */
    Element.prototype.doNextAnimation = function(callback)
    {
        //Check if this is the last animation
        if(this.animationIndex >= this.animations.length)
        {
            //All done
            callback();
            return;
        }
    
        //Duration of animation
        var duration;
        //Delay of animation
        var delay;
        //Remove last animation from the html element (defined by an animate.css class)
        $(this.htmlElement).removeClass(this.lastAnimation);
        //Get the next animation css class name
        this.lastAnimation = this.animations[this.animationIndex];
        
        //Clear duration
        $(this.htmlElement).css("animation-duration", "").css("-webkit-animation-duration", "").css("-moz-animation-duration", "").css("-ms-animation-duration", "").css("-o-animation-duration", "");
        //If we defined a duration for this animation...
        if(this.animationDuration !== undefined && this.animationDuration[this.animationIndex] !== undefined)
        {
            //... set it
            duration = this.animationDuration[this.animationIndex];
            $(this.htmlElement).css("animation-duration", duration).css("-webkit-animation-duration", duration).css("-moz-animation-duration", duration).css("-ms-animation-duration", duration).css("-o-animation-duration", duration);
        }
    
        //Clear delay
        $(this.htmlElement).css("animation-delay", "").css("-webkit-animation-delay", "").css("-moz-animation-delay", "").css("-ms-animation-delay", "").css("-o-animation-delay", "");
        //If we defined a delay for this animation...
        if(this.animationDelay !== undefined && this.animationDelay[this.animationIndex] !== undefined)
        {
            //... set it
            delay = this.animationDelay[this.animationIndex];
            $(this.htmlElement).css("animation-delay", delay).css("-webkit-animation-delay", delay).css("-moz-animation-delay", delay).css("-ms-animation-delay", delay).css("-o-animation-delay", delay);
        }
        
        //Increment animation counter
        this.animationIndex++;
        
        /*
         * Redraw element
         * This enables for two consecutive equal animations
         */
        $(this.htmlElement).redraw();
        
        //Wait for animation to finish, then call the callback function
        $(this.htmlElement).addClass(this.lastAnimation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', callback);
    };
    /**************************************************************************/
    
    /**
     * Defines a group of Elements
     */
    function Group()
    {
        /*
         * Constructor
         */
        //This Group's Elements
        this.elements = [];
        //Flag to check if this element should only be animated when visible on screen
        this.animateWhenVisible = false;
        //Flag that indicates whether an animation is being performed
        this.isPerformingAnimation = false;
        //Flag that indicates if the animation should be reseted if the element goes off screen
        this.resetWhenOffscreen = false;
        //Flag that indicates if this group should loop indefinitely
        this.repeat = false;
        //Flag to check if this group is reset (this being in a clean, start from the beginning state)
        this.isReset = true;
    }

    /**
     * Resets the animation back to the beginning
     */
    Group.prototype.reset = function()
    {
        //Check if we're not reset yet
        if(!this.isReset)
        {
            //Start iterating this group elements
            for(var i=1; i<this.elements.length; i++)
            {
                for(var j=0; j<this.elements[i].length; j++)
                {
                    //Reset animation index
                    this.elements[i][j].animationIndex = 0;
                    //Remove last animation css class
                    $(this.elements[i][j].htmlElement).removeClass(this.elements[i][j].lastAnimation);
                }
            }
        
            //Mark as reseted
            this.isReset = true;
        }
    };
    
    /**
     * Starts the animation for the Elements of this Group
     * @param {integer} iteration The iteration counter (starts at 1!)
     */
    //Thought: maybe recursion depth limit could be a problem?
    Group.prototype.animate = function(iteration)
    {
        //Auxiliary variable
        var count = 0;
        //Get Group Elements for this iteration
        var elements = this.elements[iteration];
        
        //Check if we reached the end (no more elements to animate)
        if(elements === undefined)
        {
            //Check if we should repeat
            if(this.repeat)
            {
                //Reset
                this.reset();
                //Do it again
                this.animate(1);
            }
            else
            {
                //No more animations for now
                this.isPerformingAnimation = false;
            }
            
            //Stop
            return;
        }
        
        //Indicate that this group is performing animations
        this.isPerformingAnimation = true;
        //We're no loger in a clean state
        this.isReset = false;
        
        //Iterate the Group's Elements
        for(var i=0; i<elements.length; i++)
        {
            //Perform next Element animation
            elements[i].doNextAnimation(function()
            {
                //Animation is finished
                
                //Count how many Elements have finished in this iteration
                count++;
                
                //When all Elements are finished...
                if(count == elements.length)
                {
                    //... move on tonext iteration
                    this.animate(++iteration);
                }
            }.bind(this));
        }
    };

    /**
     * Restarts the animation from the beginning
     */
    Group.prototype.restart = function()
    {
        //Restart only if not currently performing an animation
        if(!this.isPerformingAnimation)
        {
            //Reset
            this.reset();
            //Do it again
            this.animate(1);
        }
    };
    /**************************************************************************/
    
    /**
     * This library's main "class"
     */
    function AnimatePlus()
    {
        /*
         * Constructor
         */
        //List of groups that should only be animated when visible on screen
        this.onVisbileGroups = [];
        //List of groups (a map of the entire animation)
        this.map = [];
        
        //Add animate.css class
        //No need for the user to add this by hand
        $(".animate-plus").addClass("animated");
        
        //Iterate html elements to be animated (marked by the "animate-plus" css class)
        $.each($(".animate-plus"), function(key, animatedElement)
        {
            //Create Element instance
            var elementObj = new Element(animatedElement);
            //Get group name
            var group = $(animatedElement).attr("data-animation-group");
            //If no group is defined, a new group is created for this element
            if(group === undefined)
            {
                group = "_"+key;
                //Set the "data-animation-group" attribute
                $(animatedElement).attr("data-animation-group", group);
            }
            
            //Initialize map
            if(this.map[group] === undefined)
            {
                this.map[group] = new Group();
            }
            
            //Check if this group should only be animated when visible on screen
            var animateWhenVisible = $(animatedElement).attr("data-animation-when-visible");
            if(animateWhenVisible !== undefined)
            {
                //Set the flag
                this.map[group].animateWhenVisible = true;
            }
        
            //Check if this group should reset when off screen
            var resetWhenOffscreen = $(animatedElement).attr("data-animation-reset-offscreen");
            if(resetWhenOffscreen !== undefined)
            {
                //Set the flag
                this.map[group].resetWhenOffscreen = true;
            }
        
            //Check if this group should loop indefinitely
            var repeatAnimation = $(animatedElement).attr("data-animation-repeat");
            if(repeatAnimation !== undefined)
            {
                //Set the flag
                this.map[group].repeat = true;
            }
        
            //Get Group's Elements
            var groupMap = this.map[group].elements;
        
            //Get the order of animation
            var animationOrderAttribute = $(animatedElement).attr("data-animation-order");
            var useOrder = animationOrderAttribute !== undefined;
            //If an order of animation is defined
            if(useOrder)
            {
                //Parse the value
                var animationOrder = animationOrderAttribute.split(",");
            }
        
            //Get the animations (animate.css class names)
            var animations = $(animatedElement).attr("data-animations").split(",");
            //Iterate the animations
            for(var i=0; i<animations.length; i++)
            {
                //This index is used in case no implicit order of animation was set
                var index = i+1;
                //If an implicit order was set
                if(useOrder)
                {
                    //Use that
                    index = animationOrder[i];
                }
            
                //Initialize this Group's Elements Array
                if(groupMap[index] === undefined)
                {
                    groupMap[index] = [];
                }
            
                //Push the Element instance to the Group array of Elements
                groupMap[index].push(elementObj);
            }
        }.bind(this));
    
        //Register events that will help us check if an element is visible on screen
        $(window).on("scroll", function(){this.checkOnVisibleGroups();}.bind(this));
        $(window).on("resize", function(){this.checkOnVisibleGroups();}.bind(this));
        $(document).ready(function(){this.checkOnVisibleGroups();}.bind(this));
    
        /**
         * Checks if a given element is actually visible on screen
         * @param element The html element to check
         */
        this.isElementVisible = function(element)
        {
            /*
            * Inspired by Scott Dowding's answer on stackoverflow
            * http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
            */
           
           //Get Window top & bottom limit
           var topWindowLimit = $(window).scrollTop();
           var bottomWindowLimit = $(window).height() + topWindowLimit;
           //Get Element top / bottom limit
           var topElementLimit = $(element).offset().top;
           var bottomElementLimit = $(element).height() + topElementLimit;
           
           //Return whether the element is within the Window's boundaries
           return ((bottomWindowLimit >= topElementLimit) && (topWindowLimit <= bottomElementLimit));
        };
    
        /**
         * Check if it's time to animate any animate-only-when-visible group
         */
        this.checkOnVisibleGroups = function()
        {
            //Iterate groups that should be animated when visible on screen
            for(var i=0; i<this.onVisbileGroups.length; i++)
            {
                //Get group
                var groupMap = this.map[this.onVisbileGroups[i]];
                //Iterate group elements
                for(var j=1; j<groupMap.elements.length; j++)
                {
                    var elements = groupMap.elements[j];
                    for(var k=0; k<elements.length; k++)
                    {
                        //Get element
                        var element = elements[k].htmlElement;
                        //Is this element is visible and the group is not currently performing any animation
                        if(this.isElementVisible(element) && !groupMap.isPerformingAnimation)
                        {
                            //Animate this group
                            groupMap.animate(1);
                        }
                    
                        /*
                         * If the element if off screen
                         * and the group is not currently performing any animation
                         * and this group should be resetted when off screen
                         */ 
                        if(!this.isElementVisible(element) && !groupMap.isPerformingAnimation && groupMap.resetWhenOffscreen)
                        {
                            //Reset the group
                            groupMap.reset();
                        }
                    }
                }
            }
        };
    }

    /**
     * This starts moving things around!
     */
    AnimatePlus.prototype.start = function()
    {
        //For each group
        for(var group in this.map)
        {
            //Is this a group that should only be animated when visible?
            if(this.map[group].animateWhenVisible)
            {
                //Register it as such
                this.registerOnVisbileMap(group);
            }
            else
            {
                //Start right away
                this.map[group].animate(1);
            }
        }
    };
    
    /**
     * Register an group that should only be animated when visible on screen
     * @param groupName the name of the group
     */
    AnimatePlus.prototype.registerOnVisbileMap = function(groupName)
    {
        this.onVisbileGroups.push(groupName);
    };

    /**
     * Getter funtion to get the animation map
     */
    AnimatePlus.prototype.getMap = function()
    {
        return this.map;
    };

    /**
     * AnimatePlus is a singleton. This function enables us to the an instance.
     */
    AnimatePlus.instance = null;
    AnimatePlus.getInstance = function()
    {
        if(AnimatePlus.instance === null)
        {
            AnimatePlus.instance = new AnimatePlus();
        }
    
        return AnimatePlus.instance;
    };
    /**************************************************************************/
    
    /**
     * public static void main(){}
     * Point of entry
     */
    $(document).ready(function()
    {
        //Start as soon as the document is ready
        AnimatePlus.getInstance().start();
    });
}(jQuery));