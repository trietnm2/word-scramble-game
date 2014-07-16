package controllers;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.LineNumberReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;
import java.util.Scanner;

import org.apache.commons.lang.StringUtils;

import play.Play;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.fasterxml.jackson.databind.node.ObjectNode;

public class App extends Controller{

    private static String[] scrambleWord(String word) {
        ArrayList<Character> chars = new ArrayList<Character>(word.length());
        for ( char c : word.toCharArray() ) {
           chars.add(c);
        }
        Collections.shuffle(chars);
        String[] shuffled = new String[chars.size()];
        for ( int i = 0; i < shuffled.length; i++ ) {
           shuffled[i] = chars.get(i).toString();
        }
        return shuffled;
    }
    
    public static Result app() {
        return ok(views.html.game.render());
    }
    
    public static Result game() throws IOException {
        session().clear();
        File source = Play.application().getFile("app/assets/words.txt");
        LineNumberReader lnr = new LineNumberReader(new FileReader(source));
        lnr.skip(Long.MAX_VALUE);
        int numWords = lnr.getLineNumber();
        lnr.close();
        Random generator = new Random();
        int radomWord = generator.nextInt(numWords - 1);
        String realWord = "";
        String shuffedWord;
        Scanner words = new Scanner(source);
        for (int i = 0; i < radomWord; i++) {
            realWord = words.nextLine();
        }
        words.close();
        shuffedWord = StringUtils.join(scrambleWord(realWord),'-');
        session("realWord", realWord);
        return ok(views.html.gameAjax.render(numWords,realWord,shuffedWord));
    }
    
    public static Result checkResult(String answer) {
        String realWord = session("realWord");
        //JsonNode json = request().body().asJson();
        ObjectNode result =  Json.newObject();
        if(realWord.equals(answer)){
            result.put("status", "1");
        } else {
            result.put("status", "0");
        }
        
        return ok(result);
    }
}
