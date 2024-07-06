#!/bin/bash

echo -e "\e[32m _ _           _   "
echo -e "| | |__   ___ | |_ "
echo -e "| | '_ \\ / _ \\| __|"
echo -e "| | |_) | (_) | |_ "
echo -e "|_|_.__/ \\___/ \\__| \e[0m"

if [ ! -d "sessao" ]; then
  mkdir sessao
fi

if [ "$(ls -A sessao)" ]; then
    echo -e "\e[33mVerificando se há sessão ativa..."
    echo -e "\e[32mSessão encontrada! Conectando...\e[0m"
    node qr.js
else
    while true; do
        echo -e "\e[31mSem sessão ativa, escolha uma opção:\e[0m"
        echo -e "\e[34m[ 0 ] Fechar o script"
        echo -e "[ 1 ] QR-Code"
        echo -e "[ 2 ] Código de pareamento"
        echo -e "[ 4 ] Apagar sessão atual\e[0m"

        read -p "Escolha uma opção: " option

        case $option in
            0)
                echo -e "\e[34mFechando o script...\e[0m"
                exit 0
                ;;
            1)
                echo -e "\e[34mIniciando conexão com QR-Code...\e[0m"
                node qr.js
                break
                ;;
            2)
                echo -e "\e[34mIniciando conexão com código...\e[0m"
                node tel.js
                break
                ;;
            4)
                echo -e "\e[34mSessão atual apagada!\e[0m"
                rm -r sessao
                mkdir sessao
                ;;
            *)
                echo -e "\e[31mEscolha uma opção válida!\e[0m"
                ;;
        esac
    done
fi
