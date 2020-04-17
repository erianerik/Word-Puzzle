

if (!window.localStorage.getItem("name")) {
    $("#button-send").click(function () {

        console.log("Foi")
        // Pegando conteudo do input
        var namePlayer = $(".namePlayer").val();

        window.localStorage.setItem("name", namePlayer);

        // alterando a "Caixa" que vai exibir
        $(".insert-name").hide();
        $("#container").show();


        // inserindo  os dado da var name para o h3
        // document.querySelector("main section:nth-child(1) div h3").innerHTML = "nome: " + localStorage.getItem("name");


        location.reload();

    });
} else {
    $("#container").show();
    $(".insert-name").hide();
    $("#container ul + h2").html("Nome: " + localStorage.getItem("name"));

    if (!window.localStorage.getItem("bestScore")) {

    } else {
        $(".list-score").html("<li>" + localStorage.getItem("name") + " " +localStorage.getItem("bestScore") + "</li>");
    }

}
