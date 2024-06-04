$(function() {
    // Define algumas variáveis globais
    var answers = {},
        currentId,
        currentAnswer,
        checks = [],
        actualAnswers = "",
        feed,
        curCont,
        progressWidth = 0,
        score = 0,
        firstAtempt = true,
        quiz = [{
                "id": "first",
                "question": "Qual destas é uma função embutida em Python?",
                "options": {
                    "a": "print",
                    "b": "def",
                    "c": "if",
                    "d": "while"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "def é uma palavra-chave para definir funções, mas não é uma função embutida.",
                    "c": "if é uma palavra-chave para condicionais, mas não é uma função embutida.",
                    "d": "while é uma palavra-chave para loops, mas não é uma função embutida."
                }
            },
            {
                "id": "second",
                "question": "Qual destas estruturas de dados é mutável em Python?",
                "options": {
                    "a": "list",
                    "b": "tuple",
                    "c": "string",
                    "d": "int"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "tuple é imutável.",
                    "c": "string é imutável.",
                    "d": "int é imutável."
                }
            },
            {
                "id": "third",
                "question": "Qual destas bibliotecas é usada para manipulação de dados em Python?",
                "options": {
                    "a": "pandas",
                    "b": "numpy",
                    "c": "matplotlib",
                    "d": "scipy"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "numpy é usada para computação numérica, mas pandas é mais específica para manipulação de dados.",
                    "c": "matplotlib é usada para visualização de dados.",
                    "d": "scipy é usada para computação científica."
                }
            },
            {
                "id": "fourth",
                "question": "Qual destes métodos é usado para adicionar um item a uma lista em Python?",
                "options": {
                    "a": "append",
                    "b": "add",
                    "c": "insert",
                    "d": "extend"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "add não é um método válido para listas.",
                    "c": "insert é usado para adicionar um item em uma posição específica.",
                    "d": "extend é usado para adicionar todos os itens de uma lista a outra lista."
                }
            },
            {
                "id": "fifth",
                "question": "Qual destas é a maneira correta de criar um dicionário em Python?",
                "options": {
                    "a": "{'key': 'value'}",
                    "b": "['key', 'value']",
                    "c": "('key', 'value')",
                    "d": "{key: value}"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "['key', 'value'] é uma lista.",
                    "c": "('key', 'value') é uma tupla.",
                    "d": "{key: value} requer aspas para as chaves e valores."
                }
            },
            {
                "id": "sixth",
                "question": "Qual destas funções é usada para obter a entrada do usuário em Python 3?",
                "options": {
                    "a": "input",
                    "b": "raw_input",
                    "c": "scanf",
                    "d": "readline"
                },
                "answers": ["a"],
                "wrongs": {
                    "b": "raw_input é usada em Python 2.",
                    "c": "scanf é usada em C.",
                    "d": "readline é usada para ler linhas de arquivos."
                }
            }
        ];

    function roundit(x) {
        var temp = Math.round(x * 100) / 100;
        return temp;
    }

    // Inicializa o quiz e prepara as respostas
    makequiz();

    // Anima a barra de progresso equivalente a um questContainer
    var width = roundit(1 / quiz.length * 100) + "%";
    $('.container-fluid').eq(0).find('.progress-bar').html(width).animate({
        "width": roundit(1 / quiz.length * 100) + "%"
    }, 300, "linear");

    // Limpeza inicial
    $("input[type=radio]").iCheck('uncheck');
    prepareAnswers();

    // Adiciona listeners de eventos
    $('.check').click(function(ev) {
        curCont = $(this).parents('.questContainer');
        feed = curCont.find('.feedback');
        currentId = curCont.attr("id");
        currentAnswer = answers[currentId].sort();
        actualAnswers = curCont.find('input[type=radio]:checked');
        getAnswer();
        checkAnswer();
    });

    $('.why').click(function() {
        curCont = $(this).parents('.questContainer');
        index = $(curCont).attr("questindex");
        feed = curCont.find('.feedback');
        showWhy();
    });

    $('.next').click(function() {
        var questNum = parseInt($(this).parents('.questContainer').attr('questindex')) + 1,
            progressbar = $(this).parents('.container-fluid').find('.progress-bar'),
            nextprog = $(this).parents('.container-fluid').next().find('.progress-bar');
        $(this).parents('.container-fluid').fadeOut(300, function() {
            $(this).next('.container-fluid').fadeIn(300, function() {
                var width = roundit((questNum + 1) / quiz.length) * 100 + "%";
                console.log(width);
                nextprog.html(width).animate({
                    "width": width
                }, 300, "linear");
            });
        });
    });

    $('.prev').click(function() {
        var questNum = parseInt($(this).parents('.questContainer').attr('questindex')),
            progressbar = $(this).parents('.container-fluid').find('.progress-bar'),
            prevprog = $(this).parents('.container-fluid').prev().find('.progress-bar');
        $(this).parents('.container-fluid').fadeOut(300, function() {
            $(this).prev('.container-fluid').fadeIn(300, function() {
                var width = roundit((questNum) / quiz.length) * 100 + "%";
                console.log(width);
                prevprog.html(width).animate({
                    "width": width
                }, 300, "linear");
            });
        });
    });

    $('.redo').click(function() {
        $(this).parents('.questContainer').find('input').iCheck('uncheck');
        $(this).parents('alert-danger').slideUp(120);
        $(this).parents('.container-fluid').find('.check').slideDown(120);
    });

    $('.finish').click(function() {
        alert("Você acertou " + score + " questões de um total de " + quiz.length);
    });

    $('input[type=radio]').on('ifChanged', function() {
        $(feed).hide();
        $(this).parents('.container-fluid').find('.alert-danger').hide();
        $(this).parents('.container-fluid').find('.navbuttons').slideUp(200);
        $(this).parents('.container-fluid').find('.check').slideDown(200);
    });

    // Funções de funcionalidade
    function getAnswer() {
        checks = [];
        for (var i = 0, y; i < actualAnswers.length; i++) {
            y = actualAnswers[i].value;
            checks.push(y);
        }
        console.log("checks : ", checks);
    }

    function checkAnswer() {
        var counter = 0;
        checks = checks.sort();
        currentAnswer = currentAnswer.sort();
        if (!checks.length) {
            feed.show().html("<span>Por favor, selecione uma opção</span>");
            return;
        }
        if (!(checks.length == currentAnswer.length)) {
            badAnswer();
            return;
        }
        for (var i = 0; i < checks.length; i++) {
            if (checks[i] == currentAnswer[i]) counter++;
        }
        counter == currentAnswer.length ? goodAnswer() : badAnswer();
        curCont.attr("firstAtempt", false);
    }

    // Feedback
    function goodAnswer() {
        $(curCont).parents('.container-fluid').find('.check').addClass('hide');
        $(curCont).parents('.container-fluid').find('.alert-success').fadeIn(120);
        $(curCont).find('input[type=radio]').on('ifToggled', function() {
            $(this).iCheck('toggle');
        });
        $('#success-sound')[0].play();
        actualAnswers = '';
        var curAtempt = JSON.parse(curCont.attr("firstAtempt"));
        if (curAtempt) score++;
    }

    function badAnswer() {
        $(curCont).parents('.container-fluid').find('.check').hide();
        $(curCont).parents('.container-fluid').find('.alert-danger').fadeIn(120);
        curCont.attr("firstAtempt", false);
        $('#danger-sound')[0].play();
    }

    function showWhy() {
        var wrongs = quiz[index].wrongs;
        $.each(wrongs, function(key, val) {
            curCont.find('input[value=' + key + ']:checked').parents('label').addClass("success").find('div').after("<span class='glyphicon glyphicon-ok-sign' ></span>");
            curCont.find('input[value=' + currentAnswer[key] + ']:not(:checked)').parents('label').addClass("warning").find('div').after("<span class='glyphicon glyphicon-exclamation-sign' ></span>");
        });
        curCont.find('label').not('.success,.warning').has('input[type=radio]:checked').addClass("danger").find('div').after("<span class='glyphicon glyphicon-remove-sign' ></span>");
        $(curCont).parents('.container-fluid').find('.alert-danger').slideUp(120);
        $(curCont).parents('.container-fluid').find('.navbuttons').slideDown(120);
        feed.empty();
        for (var el in wrongs) feed.append(el + " : " + wrongs[el] + "<br>");
        feed.fadeIn(120);
        $(curCont).find('input[type=radio]').on('ifToggled', function() {
            $(this).iCheck('toggle');
        });
    }

    // Monta o quiz
    function makequiz() {
        quiz.forEach(function(ques, i) {
            var isfirst, question = "",
                feedbuttons, nextbutton, prevbutton,
                questionIndex = quiz.indexOf(ques),
                questionNumber = questionIndex + 1;
            isfirst = (i === 0) ? "" : "hideit",
                nextClassAndValue = (i == quiz.length - 1) ? "finish'>finish" : "next'>próximo",
                header = "<div class='container-fluid " + isfirst + "'><div class='row'><div class='col-xs-12 col-md-6 col-md-offset-3'><div class='row'><div class='questContainer' firstatempt='" + firstAtempt + "' id='" + ques.id + "' questindex='" + questionIndex + "'><ol class='breadcrumb'><li><a href='#'>Python Quiz</a></li><li><a href='#'>Level</a></li><li class='active'>Sessão</li></ol><div class='progress'><div class='progress-bar progress-bar-info' style='width: 0%;'>0%</div></div>",
                pager = "<div class='row'><div class='interact'><p class='feedback hideit'></p><div class='check hideit'><div class='col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2'><button type='button' class='btn btn-primary btn-block'>check</button></div></div><div class='navbuttons '><div class='col-xs-6'><button class='btn btn-info btn-block prev'><span class='glyphicon glyphicon-chevron-left'></span> voltar</button></div><div class='col-xs-6 '><button class='btn btn-info btn-block " + nextClassAndValue + "<span class='glyphicon glyphicon-chevron-right'></span></button></div></div><div class='alert alert-success hideit'><h4><span class='glyphicon glyphicon-ok'></span> Correta !</h4><div class='row'><div class='col-xs-6 col-md-4'><button class='btn btn-info btn-block prev' href='#'><span class='glyphicon glyphicon-chevron-left'></span> previous</button></div><div class='col-xs-6  col-md-4 col-md-offset-4'><button class='btn btn-info btn-block " + nextClassAndValue + "<span class='glyphicon glyphicon-chevron-right'></span></button></div></div></div><div class='alert alert-danger hideit'><h4><span class='glyphicon glyphicon-remove'></span>Incorreta</h4><div class='row'><div class='col-xs-6 col-md-4'><button class='btn btn-danger btn-block why' href='#'>Veja Por quê<span class='glyphicon glyphicon-question-sign'></span></button></div><div class='col-xs-6  col-md-4 col-md-offset-4'><button class='btn btn-primary btn-block redo' href='#'>repetir<span class='glyphicon glyphicon-repeat'></span></button></div></div></div></div></div></div></div></div></div>";

            question = header + "<p class='quest'>" + questionNumber + ". " + ques.question + "</p>";
            for (var opt in ques.options) {
                var choices = "";
                choices += "<label><input type='radio' name='question" + questionIndex + "' value='" + opt + "'/>" + opt + "- " + ques.options[opt] + "</label>";
                question += choices;
            }
            question += pager;
            $('body').append(question);
        });
        $('.questContainer').eq(0).find('.navbuttons div').eq(0).remove();
        $('.questContainer').eq(0).find('.alert-success .col-xs-6').eq(0).remove();
        $('.questContainer').eq(0).find('.navbuttons div,.alert-success .col-xs-6').attr("class", "col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2");
    }

    // Prepara as respostas
    function prepareAnswers() {
        quiz.forEach(function(el) {
            answers[el.id] = el.answers;
        });
    }
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
});
