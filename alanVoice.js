// Noona Script //
//              //
// Up. 8/3/2020 //
//////////////////

var patientData = {symptom:"", location:"", specifics:"", date:""};  // data object is forwarded as a command to the app at the end of the form

const vAlanQuestionnare = visual({"screen": "AlanQuestionnare"});
// visial state; ex.     alanBtnInstance.setVisualState({screen: "AlanQuestionnare"});
//intent(vAlanQuestionnare,"Begin Form",p => {
intent("(Begin Form|start|start form| begin|)", p => {
    p.play("Hello Maria, How are you feeling today? Please tell if you experience any of the following symptoms.");
    p.play("Abnormal sensation or muscle weakness Inflammation symptoms or fever, Pain, Mouth or skin symptoms, Stomach symptoms or eating problems, Heart/lung symptoms or swelling, Bleeding symptoms, Blood sugar symptoms, Urinary symptoms, Or other");
    p.then(askSymptoms);
});
var i = 0;

var askSymptoms = context(() => {
    follow(`$(SYMPTOM* (.*))`, p => {
        
        var symp = p.SYMPTOM.value;
        var symp2 = symp.split(" "); //(Now an array)
        var sympL = symp2.length;
        /*
        for(i=0; i < sympL; i++){
            var x = 
        }
        */
        switch(p.SYMPTOM.value) {
            case 'pain':
                //pain response
                patientData.symptom = "pain";  // sends to data object
                p.play("Where does it hurt?");
                p.then(askPainArea);  // moves to pain-specific questionnare
                break;   
                
            case "muscle weakness":
                
                break;
                
        }
    });
});

var askPainArea = context(() => {
    follow('$(AREA back| neck| foot| stomach|face| eyes| head|)', p => {  // will be edited to improve recognition
        switch(p.AREA.value) {
            case 'back':
                patientData.location = "back";  // send to data object
                p.play("upper or lower back?");
                p.then(subBack);
                break;
            case 'neck':
                //
                break;
        }
    });
});
// back-specific form: other symptoms may not require such form
var subBack = context(() => {
   follow('$(BACKAREA~ upper~upper|lower~lower|upper back~upper| lower back~lower| low~lower|low back~lower| up back~upper)', p => {
       if (p.BACKAREA.label == "upper"){
            patientData.specifics = "upper-back";
           p.play("When did you have this symptom?")
       } 
       else if (p.BACKAREA.label == "lower"){
           patientData.specifics = "lower-back";
           p.play("When did you have this symptom?")
       } else {
           p.play("Sorry, I didn't quite get that. Can you please repeat that?")
           p.then(subBack);
       }
       p.then(askDate);
   }); 
});

var askDate = context(() => {
   follow('(since| it began| started on| |) $(DATE)', p => {
       patientData.date = p.DATE.value;
       p.play("Noted. Thank you.");
      // p.then(sendDataForm);
       console.log(patientData);
    p.play({command: "exportPatientData", symptom: patientData.symptom, location: patientData.location, specifics: patientData.specifics, date: patientData.date});
   });
});


/*
var sendDataForm = context(() => {
    console.log(patientData);
    p.play({command: "exportPatientData", symptom: patientData.symptom, location: patientData.location, specifics: patientData.specifics, date: patientData.date});
});
*/
