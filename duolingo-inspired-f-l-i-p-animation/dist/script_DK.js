tlm = new TimelineMax({ repeat: -1, yoyo: true});
musicTlm = new TimelineMax({ repeat: -1 });
eyeMoveTlm = new TimelineMax({ repeat: -1, yoyo: true, repeatDelay: 3 });
blinkTlm = new TimelineMax({ repeat: -1, yoyo: true, repeatDelay: 4});
blink2Tlm = new TimelineMax({repeat: -1, yoyo: true, repeatDelay: 5 });
blink3Tlm = new TimelineMax({ repeat: -1, yoyo: true, repeatDelay: 3});
mouthTlm = new TimelineMax({repeat: -1, yoyo: true, repeatDelay: 1});

duration = 0.8;

 tlm.to('#top', { 
    rotate: 22, 
    transformOrigin: "50% 50%",
    x: 20,
    duration: duration,
    ease: 'power1.inOut'
 })
 .to('#top', {
    y: -10,
    duration: duration/2,
    ease: 'power1.inOut'
 }, 0)
 .to('#top', {
     y: 0,
     duration: duration/2,
     ease: 'power1.inOut'
 }, duration/2)
 .to('#footr', {
     x: -100,
     duration: duration,
     ease: 'power1.inOut',
     rotate: 25
 }, 0)
 .to('#footl', {
     x: 70,
     duration: duration,
     ease: 'power1.inOut',
     rotate: -25
 }, 0)
 .to('#arml', {
     rotate: -60,
     duration: 0.8,
     x: 30,
     y: -40,
     ease: "power3.inOut",
     transformOrigin: "100% 100%"
 }, 0)
 .to('#armr', {
    rotate: -60,
    duration: 0.8,
    ease: "power3.inOut",
    x: 0,
    y: 30,
    transformOrigin: "0% 20%"
}, 0)
.to('#floor', {
    scaleX: 0.7,
    transformOrigin: "50% 50%",
    duration: duration/2,
    ease: "power1.inOut",
    repeat: 1,
    yoyo: true
}, 0)


spillTlm = new TimelineMax({ repeat: -1});

spillTlm.from('#spill', {
    opacity: 0,
}, 0.2)
.from('#spill > path', {
    scale: 0,
    x: -10,
    y: 10,
    stagger: 0.2,
    transformOrigin: "0% 100%",
    duration: duration/2,
    ease: "power1.out"
}, 0.2)
.to('#spill > path', {
    opacity: 0.2,
    duration: duration/2
}, duration/2)
.from('#spill > *:not(path)', {
    x: -10,
    y: 30,
    ease: "power1.out"
}, 0.2)
.to('#spill > *:not(path)', {
    opacity: 0.2,
    duration: 0.2
}, duration/2)


musicTlm.from('#note1',
    {
        x: -20,
        y: 50,
        opacity: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut"
    })
    .to('#note1', {
        opacity: 0,
        duration: 0.5
    }, 1.5)
    .from('#note2',
    {
        x: 10,
        y: 50,
        opacity: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut"
    },1)
    .to('#note2', {
        opacity: 0,
        duration: 0.5
    }, 2.5);


mouthTlm.to(['#mouthDuplicate','#mouthCenter'], { x: 7, y: -3 })
.to('#mouth', { scaleY: 0.6, transformOrigin: "50% 50%" }, 0)



eyeMoveTlm.to(['#eyes > g > g'], {
    y: 5,
    duration: 0.2
})
.to(['#eyes > g > g'], {
    x: 5,
    y: -2,
    rotate: -10,
    delay: 2,
    duration: 0.2
})
.to(['#reflectionR', '#reflectionL'], {
    x: 5,
    y: -2,
    duration: 0.2
}, 2);

blink2Tlm
.to('#eyes', {
    delay: 9,
    display: 'none'
})
.to('#eyes-closed', {
    display: 'block'
});

blink3Tlm.to('#eyelidL', { 
    scaleY: 2.1, 
    scaleX: 1.2, 
    y: -4, 
    rotate: -5, 
    transformOrigin: "100% 0%", 
    duration: 0.1
})
.to('#eyelidL', {
    scaleY: 1, 
    scaleX: 1, 
    y: 0, 
    rotate: 0, 
    transformOrigin: "100% 0%", 
    duration: 0.1
});