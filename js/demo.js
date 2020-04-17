// ----------------------------------------------------------------------------
// Yes, we make magic!
// ----------------------------------------------------------------------------


buzz.defaults.formats = ['ogg', 'mp3'];
buzz.defaults.preload = 'metadata';

var games = [
    { img: 'img/alligator.png', word: 'Alligator', sound: 'sounds/alligator' },
    { img: 'img/bat.png', word: 'bat', sound: 'sounds/bat' },
    { img: 'img/cat.png', word: 'Cat', sound: 'sounds/cat' },
    { img: 'img/camel.png', word: 'Camel', sound: 'sounds/camel' },
    { img: 'img/dog.png', word: 'Dog', sound: 'sounds/dog' },
    { img: 'img/dolphin.png', word: 'dolphin', sound: 'sounds/dolphin' },
    { img: 'img/eagle.png', word: 'eagle', sound: 'sounds/eagle' },
    { img: 'img/fox.png', word: 'fox', sound: '' },
    { img: 'img/frog.png', word: 'frog', sound: 'sounds/frog' },
    { img: 'img/goat.png', word: 'goat', sound: 'sounds/goat' },
    { img: 'img/kangaroo.png', word: 'kangaroo', sound: 'sounds/kangaroo' },
    { img: 'img/mouse.png', word: 'mouse', sound: 'sounds/mouse' },
    { img: 'img/parrot.png', word: 'parrot', sound: 'sounds/parrot' },
    { img: 'img/pig.png', word: 'pig', sound: 'sounds/pig' },
    { img: 'img/rhinoceros.png', word: 'rhinoceros', sound: 'sounds/rhinoceros' },
    { img: 'img/sheep.png', word: 'sheep', sound: 'sounds/sheep' },
    { img: 'img/snake.png', word: 'snake', sound: 'sounds/snake' },
    { img: 'img/spider.png', word: 'spider', sound: 'sounds/spider' },
    { img: 'img/wolf.png', word: 'wolf', sound: 'sounds/wolf' },
    { img: 'img/zebra.png', word: 'zebra', sound: 'sounds/zebra' }
];

var winSound = new buzz.sound('sounds/win'),
    errorSound = new buzz.sound('sounds/error'),
    alphabetSounds = {},
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''),
    scoreBest = 0,
    scorePlayer = 0;

    


for (var i in alphabet) {
    var letter = alphabet[i];
    alphabetSounds[letter] = new buzz.sound('sounds/kid/' + letter);
}

$(function () {
    if (!buzz.isSupported()) {
        $('#warning').show();
    }

    var idx = 0,
        $container = $('#container'),
        $picture = $('#picture'),
        $models = $('#models'),
        $letters = $('#letters');

    $('body').bind('selectstart', function () {
        return false
    });

    $('#next').click(function () {
        refreshGame();
        buildGame(++idx);
        return false;
    });

    $('#previous').click(function () {
        refreshGame();
        buildGame(--idx);
        return false;
    });

    $('#level').click(function () {
        if ($(this).text() == 'easy') {
            $(this).text('hard');
            $models.addClass('hard');
        } else {
            $(this).text('easy');
            $models.removeClass('hard');
        }
        return false;
    });

    function refreshGame() {
        $('#models').html('');
        $('#letters').html('');
    }

    function buildGame(x) {
        if (x > games.length - 1) {
            idx = 0;
        }
        if (x < 0) {
            idx = games.length - 1;
        }

        var game = games[idx],
            score = 0;

        var gameSound = new buzz.sound(game.sound);
        gameSound.play();

        // Fade the background color
        $('body').stop().animate({
            backgroundColor: game.color
        }, 1000);
        $('#header a').stop().animate({

        }, 1000);

        // Update the picture
        $picture.attr('src', game.img)
            .unbind('click')
            .bind('click', function () {
                gameSound.play();
            });

        // Build model
        var modelLetters = game.word.split('');

        for (var i in modelLetters) {
            var letter = modelLetters[i];
            $models.append('<li>' + letter + '</li>');
        }

        var letterWidth = $models.find('li').outerWidth(true);

        $models.width(letterWidth * $models.find('li').length);

        // Build shuffled letters
        var letters = game.word.split(''),
            shuffled = letters.sort(function () { return Math.random() < 0.5 ? -1 : 1 });

        for (var i in shuffled) {
            $letters.append('<li class="draggable">' + shuffled[i] + '</li>');
        }

        $letters.find('li').each(function (i) {
            var top = ($models.position().top) + (Math.random() * 100) + 80,
                left = ($models.offset().left - $container.offset().left) + (Math.random() * 20) + (i * letterWidth),
                angle = (Math.random() * 30) - 10;

            $(this).css({
                top: top + 'px',
                left: left + 'px'
            });

            rotate(this, angle);

            $(this).mousedown(function () {
                var letter = $(this).text();
                if (alphabetSounds[letter]) {
                    alphabetSounds[letter].play();
                }
            });
        });

        $letters.find('li.draggable').draggable({
            zIndex: 9999,
            stack: '#letters li'
        });

        $models.find('li').droppable({
            accept: '.draggable',
            hoverClass: 'hover',
            drop: function (e, ui) {
                var modelLetter = $(this).text(),
                    droppedLetter = ui.helper.text();

                if (modelLetter == droppedLetter) {
                    ui.draggable.animate({
                        top: $(this).position().top,
                        left: $(this).position().left
                    }).removeClass('draggable').draggable('option', 'disabled', true);

                    rotate(ui.draggable, 0);

                    score++;

                    if (score == modelLetters.length) {
                        winGame();
                        
                    }
                } else {
                    ui.draggable.draggable('option', 'revert', true);
                   
                    errorSound.play();
                   

                    setTimeout(function () {
                        ui.draggable.draggable('option', 'revert', false);
                       
                    }, 100);
                }
            }
        });
    }

    function winGame() {
        scorePlayer += 1;
        localStorage.setItem("Score", scorePlayer)
        
        winSound.play();
        
        if (localStorage.getItem("Score") > localStorage.getItem("bestScore")) {
            $(".list-score").html("<li>" + localStorage.getItem("name") + " " + localStorage.getItem("Score") +"</li>")
        }

      

        scoreBest += 1;

        $(" .more ").show();
        localStorage.setItem("bestScore", scoreBest)


        $("#container a + h2").html("Pontuação: " + window.localStorage.getItem("Score"));

        $('#letters li').each(function (i) {
            var $$ = $(this);
            setTimeout(function () {
                $$.animate({
                    top: '+=60px'
                });
            }, i * 300);
        });

        setTimeout(function () {
            refreshGame();
            buildGame(++idx);
            $(" h2 + p ").hide();
        }, 3000);


    }

    function rotate(el, angle) {
        $(el).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });

    }

    buildGame(idx);
});