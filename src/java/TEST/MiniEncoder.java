/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package TEST;

import java.util.Collections;
import static java.util.stream.Collectors.joining;
import java.util.stream.Stream;

/**
 *
 * @author USUARIO
 */
public class MiniEncoder {

    public MiniEncoder() {
    }

    public String encoding(String characters) {
        return encryptyCesar(valuesReplace(characters));
    }
    public String encodeNumbers(String number)
    {
        String response = codeII(getSuperID(number));
        return encryptyCesarII(response);
    }

    private String encryptyCesar(String text) {
        String llave = "umlproject6module";
        StringBuilder cifrado = new StringBuilder();
        int limite = (getNumber(llave)) % 26;
        for (int i = 0; i < text.length(); i++) {
            int codigo = (int) Math.floor(Math.random() * (1 - limite + 1) + limite);
            if (text.charAt(i) >= 'a' && text.charAt(i) <= 'z') {
                if ((text.charAt(i) + codigo) > 'z') {
                    cifrado.append((char) (text.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (text.charAt(i) + codigo));
                }
            } else if (text.charAt(i) >= 'A' && text.charAt(i) <= 'Z') {
                if ((text.charAt(i) + codigo) > 'Z') {
                    cifrado.append((char) (text.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (text.charAt(i) + codigo));
                }
            }
        }
        return cifrado.toString();
    }

    private int getNumber(String information) {
        int num = 0;
        for (int i = 0; i < information.length(); i++) {
            num += (int) information.charAt(i);
        }
        return num;
    }

    private String valuesReplace(String characters) {
        for (int i = 0; i < characters.length(); i++) {
            char charx = characters.charAt(i);
            switch (charx) {
                case '0':
                    characters = characters.replace(String.valueOf(charx), "Acd");
                    break;
                case '1':
                    characters = characters.replace(String.valueOf(charx), "Bx");
                    break;
                case '2':
                    characters = characters.replace(String.valueOf(charx), "zs");
                    break;
                case '3':
                    characters = characters.replace(String.valueOf(charx), "YOu");
                    break;
                case '4':
                    characters = characters.replace(String.valueOf(charx), "Pex");
                    break;
                case '5':
                    characters = characters.replace(String.valueOf(charx), "Dr");
                    break;
                case '6':
                    characters = characters.replace(String.valueOf(charx), "Ypx");
                    break;
                case '7':
                    characters = characters.replace(String.valueOf(charx), "ATH");
                    break;
                case '8':
                    characters = characters.replace(String.valueOf(charx), "Vl");
                    break;
                case '9':
                    characters = characters.replace(String.valueOf(charx), "POx");
                    break;
                case ' ':
                    characters = characters.replace(String.valueOf(charx), "bp");
                    break;
                default:
                    break;
            }
        }
        return characters;
    }

    public String getSuperID(String num) {
        String zeros = repeat("0",10 - num.length());
        return zeros+num;
    }

    private static String repeat(String str, int times) {
        return Stream.generate(() -> str).limit(times).collect(joining());
    }
    
    private String replaceval1(String characters) {
            switch (characters) {
                case "0":
                    characters = "q";
                    break;
                case "1":
                    characters = "w";
                    break;
                case "2":
                    characters = "e";
                    break;
                case "3":
                    characters = "r";
                    break;
                case "4":
                    characters = "t";
                    break;
                case "5":
                    characters = "y";
                    break;
                case "6":
                    characters = "u";
                    break;
                case "7":
                    characters = "i";
                    break;
                case "8":
                    characters = "o";
                    break;
                case "9":
                    characters = "p";
                    break;
                case " ":
                    characters = "E";
                    break;
                default:
                    break;
            }
        return characters;
    }
    private String replaceval2(String characters) {
            switch (characters) {
                case "0":
                    characters = "D";
                    break;
                case "1":
                    characters = "l";
                    break;
                case "2":
                    characters = "k";
                    break;
                case "3":
                    characters = "g";
                    break;
                case "4":
                    characters = "j";
                    break;
                case "5":
                    characters = "a";
                    break;
                case "6":
                    characters = "d";
                    break;
                case "7":
                    characters = "S";
                    break;
                case "8":
                    characters = "f";
                    break;
                case "9":
                    characters = "s";
                    break;
                case " ":
                    characters = "h";
                    break;
                default:
                    break;
            }
        return characters;
    }
    private String replaceval3(String characters) {
            switch (characters) {
                case "0":
                    characters = "x";
                    break;
                case "1":
                    characters = "v";
                    break;
                case "2":
                    characters = "b";
                    break;
                case "3":
                    characters = "c";
                    break;
                case "4":
                    characters = "z";
                    break;
                case "5":
                    characters = "n";
                    break;
                case "6":
                    characters = "M";
                    break;
                case "7":
                    characters = "C";
                    break;
                case "8":
                    characters = "m";
                    break;
                case "9":
                    characters = "Z";
                    break;
                case " ":
                    characters = "X";
                    break;
                default:
                    break;
            }
        return characters;
    }
    
    private String codeII(String num)
    {
        String result = "";
        for (int row = 0; row < num.length(); row++) {
            if(row%3==0)
            {
                result += replaceval1(String.valueOf(num.charAt(row)));
            }
            else
            {
                if(row%2==0)
                {
                    result += replaceval2(String.valueOf(num.charAt(row)));
                }
                else
                {
                    result += replaceval3(String.valueOf(num.charAt(row)));
                }
            }
        }
        return result;
    }
    
    
    private String encryptyCesarII(String text) {
        String llave = "umlproject6module";
        StringBuilder cifrado = new StringBuilder();
        int limite = (getNumber(llave)) % 26;
        for (int i = 0; i < text.length(); i++) {
            int codigo = limite;
            if (text.charAt(i) >= 'a' && text.charAt(i) <= 'z') {
                if ((text.charAt(i) + codigo) > 'z') {
                    cifrado.append((char) (text.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (text.charAt(i) + codigo));
                }
            } else if (text.charAt(i) >= 'A' && text.charAt(i) <= 'Z') {
                if ((text.charAt(i) + codigo) > 'Z') {
                    cifrado.append((char) (text.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (text.charAt(i) + codigo));
                }
            }
        }
        return cifrado.toString();
    }
}
