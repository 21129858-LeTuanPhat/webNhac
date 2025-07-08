
/**
 * 1. render songs
 * 2. Scroll top
 * 3. Play/ pause / seek
 * 4. Cd rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next /Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view 
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY ='MY_MUSIC'


const heading =$('header h2')
const cdThumb =$('.cd-thumb')
const audio =$('#audio')

const playBtn =$('.btn-toggle-play')
const player = $('.player')
const progress =$('#progress')
const timeon = $('#TimeOn')
const sumTime =$('#SumTime')
const nextbtn = $('.btn-next')
const prevbtn =$('.btn-prev')
const randombtn=$('.btn-random')
const repeatbtn =$('.btn-repeat')
const playlist =$('.playlist')


console.log(repeatbtn)

const app ={
    currentIndex: 0,
    isPlay:false,
    isRandom:false,
    playedIndex:[],
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    setConfig(key,value){
        this.config[key]=value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
 songs:[
    {
        name:'Nắng ấm xa dần',
        singer:'Sơn tùng',
        path:'./music/song1.mp3',
        image:'./image/anh1.png'
    },
    {
        name:'Chúng ta của hiện tại',
        singer:'Sơn tùng',
        path:'./music/song2.mp3',
        image:'./image/anh2.png'
    },
    {
        name:'Chúng ta không thuộc về nhau',
        singer:'Sơn tùng',
        path:'./music/song3.mp3',
        image:'./image/anh3.png'
    },
    {
        name:'Muộn rồi mà sao còn',
        singer:'Sơn tùng',
        path:'./music/song4.mp3',
        image:'./image/anh3.png'
    },
    {
        name:'Cơn mưa ngang qua',
        singer:'Sơn tùng',
        path:'./music/song5.mp3',
        image:'./image/anh3.png'
    },
    {
        name:'Một năm mới bình an',
        singer:'Sơn tùng',
        path:'./music/song6.mp3',
        image:'./image/anh3.png'
    },
    {
        name:'Chắc ai đó sẽ về',
        singer:'Sơn tùng',
        path:'./music/song7.mp3',
        image:'./image/anh3.png'
    },
],
    //TODO:Phần 1
    render(){
        var htmls=''
        this.songs.forEach(function(song,index){
            //Trong foreach nó cũng có this đại diện cho thằng đối tượng hiện tại của nó nha
            htmls+=`
            <div  class="song ${index === app.currentIndex ? 'active':''}" data-index="${index}">
        <div class="thumb"
        style="background-image: url('${song.image}');"
        >
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
     </div>
            </div>
            `
        })
        
        playlist.innerHTML=htmls
    },
    //TODO: Xong phần 1
    handleEvent(){
            //TODO : Phần 4 
            //Xử lý cd quay / dừng 
           const cdThumbAnimate= cdThumb.animate([
                {
                    transform:'rotate(360deg)'
                }
            ],{
                duration:10000, //10 second
                iterations:Infinity
            }
        ) // Return về một đối tượng animate có các thuộc tính nhớ lên mạng đọc
        console.log(cdThumbAnimate)
        cdThumbAnimate.pause()

        //TODO: phần 2 
        const cdElement = $('.cd')
        const cdWidth =cdElement.offsetWidth
        document.onscroll=function(){
            // console.log(Math.floor(window.scrollY)) // cho biết vị trí kiểu khi mình cuộn lên cuộn xuống í
            // document.documentElement là (lấy ra ELement của thẻ html í)
            const scrollTop = window.scrollY || document.documentElement.scrollTop // Hai thằng này như nhau như ghi như này 
            //Vì có thể có trình duyệt không hỗ trợ window.scrollY
            // console.log(Math.floor(scrollTop))
            const newCdWidth = cdWidth - Math.floor(scrollTop)

            if(newCdWidth <0){
                cdElement.style.width=0 +'px'
            }else {
            cdElement.style.width=newCdWidth +'px'
            }
            cdElement.style.opacity=newCdWidth/cdWidth
        }
        //TODO Xong phần 2 

        //TODO Phần 3 : play
        playBtn.onclick= function(event){
            if(app.isPlay){
                audio.pause()
            }else{
                audio.play()
                
            }
             }
            //Khi song đang được play
            audio.onplay=function(){
                app.isPlay=true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            //Khi song bị pause
            audio.onpause=function(){
                 app.isPlay=false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            } 

            //Khi tiến độ bài thay đổi 
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    const seconds = Math.floor(audio.currentTime % 60)
                    const minute =Math.floor(audio.currentTime / 60)
                    timeon.textContent= `${minute < 10 ? '0' : ''}${minute}:${seconds < 10 ? '0' : ''}${seconds}`
                    progress.value =progressPercent
                }
            }
            //Xử lý khi tua song
            progress.oninput =function(){
                const seekTime=(progress.value/100) *audio.duration
                audio.currentTime=seekTime
                
            }
            //TODO : Xong phần 3
           
            //Xử lý sự kiên nút Next 
            nextbtn.onclick=function(){
                if(app.isRandom){
                    app.playRandom()
                }else{
                    app.nextSong()
                }
                audio.play()
                app.render()
                app.scrollToActiveSong()
            }
            //Xử lý khi prev
            prevbtn.onclick=function(){
               if(app.isRandom){
                    app.playRandom()
                }else{
                    app.prevSong()
                }
                audio.play()
                 app.render()
                 app.scrollToActiveSong()
            }
            //Xử lý nút random
            randombtn.onclick=function(event){
                if(app.isRandom){
                    app.isRandom=false;
                    app.setConfig('isRandom',app.isRandom)
                    randombtn.classList.remove('active')
                }else{
                    app.isRandom=true;
                    app.setConfig('isRandom',app.isRandom)
                    randombtn.classList.add('active')
                }
            }
            //Xử lý next song khi audio ended
            audio.onended=function(){
                if(app.isRepeat){
                   audio.play()
                }else{
                    nextbtn.click() // tương đương với việc mình nhấn click dậy nó tự ản vô method trên kia next.onclick luôn
                }
                
            }
            //Xử lý repeat
            repeatbtn.onclick=function(){
                if(app.isRepeat){
                    app.isRepeat=false;
                    app.setConfig('isRepeat',app.isRepeat)
                    repeatbtn.classList.remove('active')
                }else{
                    app.isRepeat=true;
                    app.setConfig('isRepeat',app.isRepeat)
                    repeatbtn.classList.add('active')
                }
            }
            //Lắng nghe hành vi click và playlist thật ra ta có thể làm kiểu là onclick vô chỗ render luôn
            // nhưng cách đó không hay nếu sau này người ta thêm vào nữa thì mình sẽ phải render lại 

            playlist.onclick=function(e){
                //Method closest khá hay nếu ở đây ta nhấn bất kì phần tử con nào nằm trong thằng có class ='song'
                //Thì nó đều trả về thằng có class song luôn
                                                //là có class song nhưng không có class active
                var x =e.target.closest('.song:not(.active)')
                if(x||e.target.closest('.option')){
                //Xử lý khi click vào song
                    if(x){
                        // console.log(x.getAttribute('data-index'))
                        //TODO getAttribute() bằng với dataset.cái tên mình đặt ở đây là index thì ghi là dataset.index
                        app.currentIndex = Number(x.dataset.index)
                        console.log(app.currentIndex)
                        app.loadCurrentSong();
                        audio.play()
                        app.render()
                    }
                //Xử lý khi click vào option

                }
            }

       
    },
    defineProperties(){
        //TODOCái chỗ làm này kiểu như thêm một thuộc tính vào đối tượng í mà làm như này thì kiếm soát với code dễ hơn
        Object.defineProperty(this,'currentSong',{
            get(){
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage= `url('${this.currentSong.image}')`
        audio.src =this.currentSong.path
        audio.onloadedmetadata =function(){
            const totalSeconds = audio.duration;
            // console.log(totalSeconds)
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            sumTime.textContent=`0${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        }
        timeon.textContent='00:00'
    },
    nextSong(){
         this.currentIndex += 1;
    if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
    }
    this.loadCurrentSong();
    },
    prevSong(){
       this.currentIndex -= 1;
    if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    },

    playRandom(){
        let newIndex
        if(this.playedIndex.length === this.songs.length){
            this.playedIndex=[]
        }
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex
                ||this.playedIndex.includes(newIndex)
        )

      this.currentIndex = newIndex
      this.playedIndex.push(newIndex);
      console.log(this.playedIndex)
            this.loadCurrentSong();
            audio.play()
    },
    scrollToActiveSong(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end',
            })
        },100)
    },
    loadConfig(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        
    },
    start(){
        //Load config
        this.loadConfig()

        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (Dom event)
        this.handleEvent()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render lại danh sách bài hát
        this.render()

        repeatbtn.classList.toggle('active',app.isRepeat)
        randombtn.classList.toggle('active',app.isRandom)
    }
}
app.start()


