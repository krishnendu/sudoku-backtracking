var boxes=document.querySelectorAll('.box');
var gs = new Set([1,2,3,4,5,6,7,8,9]);
var dgrid,positions_changed=0,max_pos=0,zero_c=0;
var obj;


function oned2twod(n){
	let r,c;
	r=parseInt(n/9);
	c=parseInt(n)%9;
	return [r,c];
}

function twod2oned(r,c){
	let n;
	r=parseInt(r);
	c=parseInt(c);
	n=r*9+c;
	return n;
}

Set.prototype.union = function(otherSet) 
{ 
    var unionSet = new Set(); 
    for (var elem of this) 
    { 
        unionSet.add(elem); 
    }
    for(var elem of otherSet) 
        unionSet.add(elem);
    return unionSet; 
}

Set.prototype.intersection = function(otherSet) 
{ 
    var intersectionSet = new Set(); 
    for(var elem of otherSet) 
    { 
        if(this.has(elem)) 
            intersectionSet.add(elem); 
    } 
return intersectionSet;                 
} 

Set.prototype.difference = function(otherSet) 
{ 
    var differenceSet = new Set();
    for(var elem of this) 
    { 
        if(!otherSet.has(elem)) 
            differenceSet.add(elem); 
    }
    return differenceSet; 
} 

Array.prototype.shuffle = function (y) {
    this.sort(() => Math.random() - 0.5);
    return this;
}

var grid = new Array();
gridGen();
display();

function gridGen(){
    for(let i=0 ;i<9;i++)
    {
        grid[i]=[];
        for(let j=0;j<9;j++)
        grid[i].push(0);
    }
    for (let y=0;y<9;y++){
        for (let x=0;x<9;x++){
            if(grid[y][x]==0)
                zero_c++;
        }
    }
    let start, end;
    start = new Date().getTime();
    solve();
    end = new Date().getTime();
    console.log(end-start);
    console.log(grid);
}

function solve(){
    for (let y=0;y<9;y++){
        for (let x=0;x<9;x++){
            if(grid[y][x]==0){
                let number_set = new Set([1,2,3,4,5,6,7,8,9].shuffle());
                number_set.forEach((n) => {
                // while(number_set.size >0)
                // {
                //     let n = number_set.push();
                // }
                // for (let n=1;n<10;n++){
                    if(possible(y,x,n)){
                        grid[y][x] = n;
                        positions_changed++;
                        solve();
                        if(zero_c==positions_changed)
                            return;
                        grid[y][x] = 0;
                        positions_changed--;
                    }
                });
                // if(max_pos<positions_changed){
                //     max_pos = positions_changed;
                //     obj=JSON.parse(JSON.stringify(grid));
                // }
                return;
            }
        }
    }
    
}

function possible (y,x,n) {
    let rcc,bc,uc;
    rcc = row_colCheck(y,x);
    bc = _blockCheck(y,x);
    uc= rcc.union(bc);    
    return (!uc.has(n));
}

function _check_create (y,x,n) {
    let rcc,bc,uc;
    let gc = new Set([1,2,3,4,5,6,7,8,9]);
    rcc = row_colCheck(y,x);
    bc = _blockCheck(y,x);
    uc= rcc.union(bc);    
    return (gc.difference(uc));
}

function row_colCheck(r,c){
    var rc = new Set();
    var cc = new Set();
    for(let i = 0;i<9;i++){
        let k = grid[r][i];
        let l = grid[i][c];
        if(k && c!=i){ 
            rc.add(k);       
        }
        if(l && r!=i){ 
            cc.add(l);       
        }
    }
    return rc.union(cc);
}

function _blockCheck(r,c){
    var bc = new Set();
	let _r=parseInt(r/3)*3;
    let _c=parseInt(c/3)*3;
	for(let i =_r ;i<_r+3;i++){
		for(let j =_c;j<_c+3;j++){
			let k = grid[i][j];
            if(k && !(r==i && c==j)){
                bc.add(k);       
            }
		}
    }
    return bc;
}

//End of Grid generate

// boxes.forEach( (el,index) => {

// 	el.onclick = function(){
// 		let num = this.innerText;
// 		this.innerText =(num>0 && num<9) ? this.innerText-(-1) : 1;

// 		console.log(check(el,parseInt(index)));

// 		for(let i=0;i<81;i++){
// 			let items=boxes[i];
// 			check(items,i);
// 		}
// 	};
// });
function check(el,index){
    let n = parseInt(el.innerText);
    let rc,cc,bc,uc,dc;
    rc = rowCheck(index);
    cc = columnCheck(index);
    bc = blockCheck(index);
    uc = rc.union(cc);
    uc= uc.union(bc);
    dc= gs.difference(uc);
    if(uc.has(n))
        boxes[index].style.backgroundColor = 'red';
    else
        boxes[index].style.backgroundColor = '';
    return dc;
    
}
function rowCheck(index){
    index = parseInt(index);
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    r=indexa[0];
    c=indexa[1];
    var rc = new Set();
    for(let i = 0;i<9;i++){
        let l = twod2oned(r,i);
        let k = parseInt(boxes[l].innerText);
        if(k && index!=l){ 
            rc.add(k);       
        }
    }
    return rc;
}
function columnCheck(index){
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    r=indexa[0];
    c=indexa[1];
    var cc = new Set();
    for(let i = 0;i<9;i++){
        let l = twod2oned(i,c);
        let k = parseInt(boxes[l].innerText);
        if(k && index!=l){ 
            cc.add(k);       
        }
    }
    return cc;
}
function blockCheck(index){
    let indexa,r,c,n;
    n=boxes[index].innerText;
    indexa=oned2twod(index);
    var bc = new Set();
	r=parseInt(indexa[0]/3)*3;
    c=parseInt(indexa[1]/3)*3;
	for(let i =r ;i<r+3;i++){
		for(let j =c;j<c+3;j++){
			let l = twod2oned(i,j);
            let k = parseInt(boxes[l].innerText);
            if(k && index!=l){ 
                bc.add(k);       
            }
		}
    }
    return bc;
}


function display(){
    dgrid = JSON.parse(JSON.stringify(grid));
    //console.log(grid,dgrid);
    let count =40;
    while(count >0){
        let i,j;
        i = (parseInt(Math.random()*100)%9);
        j = (parseInt(Math.random()*100)%9);
        
        if(dgrid[i][j]!=0)
        {
            dgrid[i][j]=0;
            count--;
        }
    }
    console.log(dgrid);
    boxes.forEach( (el,index) => {
        let indexa,i,j;
        indexa=oned2twod(index);
        //console.log(i,j);
        i=indexa[0];
        j=indexa[1];
        if(dgrid[i][j]==0){
            el.onclick = function(){
                let num = this.innerText;
                this.innerText =(num>0 && num<9) ? this.innerText-(-1) : 1;
                //console.log(check(el,parseInt(index)));
                for(let i=0;i<81;i++){
                    let items=boxes[i];
                    check(items,i);
                }
            };
        }
        else{
            el.innerText=dgrid[i][j];
        }

        

        
    });

}