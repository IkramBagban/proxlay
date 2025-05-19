export class StoreManager {
    data: Set<any>;

    constructor(){
        this.data = new Set()
    }
    
    set(data: any) {
        this.data.add(data);
    }

}