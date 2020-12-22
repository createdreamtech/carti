import { Bundle, } from "@createdreamtech/carti-lib";
import { CartiConfigStorage } from "../storage"
export type PublishType = "s3" | "disk"

export class Publisher {

    constructor(){
    }
    
}

export async function publish(bundle: Bundle, src: PublishType){
   
    switch(src){
        case "s3":
            
    }

}