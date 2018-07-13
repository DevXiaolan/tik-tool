import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {Toast, Modal as ModalMobile, Slider, Progress} from 'antd-mobile';
import Icon from 'components/Icon';
import Modal from 'components/ModalAntd';
import ToastContent from 'components/ToastContent';
import {getFileAccepts, isImageForSuffix, isImageForAccept} from 'utils/fileAccept';
import browserAttr from 'utils/browserAttr';
import getSrc from 'utils/imgSrc';
import ImageShow from 'components/ImageShow';
import API from '../../middlewares/api';
import {EXIF} from 'exif-js';
import $ from 'jquery';
import QueueAnim from 'rc-queue-anim';

import './style.scss';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 是否正在上传
            isUploading         :   false,
            // 上传进度
            uploadingProgress   :   0,
            // 已上传文件列表
            fileList            :   [],
            // 是否裁剪图片
            isCutImage          :   false,
            // 是否正在准备裁剪图片
            isInitImageCut      :   false,
            // 裁剪图片参数
            cutImageNum         :   {width: 0, height: 0, marginTop: 0, marginLeft: 0, scale: 1, rotate: 0},
            // 裁剪区域参数
            cutRegionNum        :   {marginTop: 0, marginLeft:0},
            // 裁剪无效区参数-上
            cutNoneTopNum       :   {width: 0, height: 0, marginTop: 0, marginLeft: 0},
            // 裁剪无效区参数-下
            cutNoneBottomNum    :   {width: 0, height: 0, marginTop: 0, marginLeft: 0},
            // 裁剪无效区参数-左
            cutNoneLeftNum      :   {width: 0, height: 0, marginTop: 0, marginLeft: 0},
            // 裁剪无效区参数-右
            cutNoneRightNum     :   {width: 0, height: 0, marginTop: 0, marginLeft: 0},
            // 图片预览参数
            previewImageNum     :   {isPreview: false, showIndex: 0}
        };
        // 文件列表样式
        this.fileListStyle = {};
        // 文件后缀
        this.fileExt = null;
        // 文件类型
        this.fileAccept = null;
        // 图片裁剪尺寸
        this.imageSize = {width: 0, height: 0};
        // 裁剪内容参数
        this.cutContentNum = {width: 0, height: 0};
        // 裁剪图片参数
        this.cutImage = {image: null, width: 0, height: 0};
        // 图片裁剪画布区域
        this.cutImageCanvasArea = 0;
        // 是否重绘裁剪图片
        this.isDrawCutImage = false;
        // 是否旋转裁剪画布
        this.isRotateCutImage = false;
        // 裁剪拖动坐标
        this.cutMoveCoordinate = null;
    }

    static propTypes =
    {
        // 对象名 (此参数将上传服务器)
        obj                 :   React.PropTypes.string,
        // 对象名数据名 (服务器将依赖此名获取对象名数据)
        objName             :   React.PropTypes.string,
        // 文件数据名 (服务器将依赖此名获取文件数据)
        fileName            :   React.PropTypes.string,
        // 文件类型 (此参数将上传服务器;fileExt不为空时将依赖此限制文件类型)
        fileType            :   React.PropTypes.oneOf(['image', 'music', 'video', 'file']),
        // 文件类型数据名 (服务器将依赖此名获取文件类型数据)
        fileTypeName        :   React.PropTypes.string,
        // 上传url
        uploadUrl           :   React.PropTypes.string,
        // 文件标签名
        labelName           :   React.PropTypes.string,
        // 是否显示文件标签名
        isShowLabelName     :   React.PropTypes.bool,
        // 文件后缀
        fileExt             :   React.PropTypes.array,
        // 文件最大大小 (单位: KB)
        fileSize            :   React.PropTypes.number,
        // 文件最大个数 (-1: 无限)
        fileLength          :   React.PropTypes.number,
        // 图片裁剪尺寸 (实际尺寸依赖终端)
        imageSize           :   React.PropTypes.object,
        // 列表尺寸
        listSize            :   React.PropTypes.object,
        // 初始文件列表
        initialFiles        :   React.PropTypes.object,
        // 事件:文件列表改变
        onChange            :   React.PropTypes.func,
        // 默认文件
        defaultFiles        :   React.PropTypes.array,
        // 是否可编辑
        editable            :   React.PropTypes.bool,
        // 上传后是否加入上传列表 (false时将被无限个数;一般用于特殊演示类上传)
        isAddFileList       :   React.PropTypes.bool,
        // 上传图标
        uploadIcon          :   React.PropTypes.element
    }

    static defaultProps =
    {
        // 对象名数据名 (服务器将依赖此名获取对象名数据)
        objName             :   'obj',
        // 文件数据名 (服务器将依赖此名获取文件数据)
        fileName            :   'file',
        // 文件类型数据名 (服务器将依赖此名获取文件类型数据)
        fileTypeName        :   'fileType',
        // 是否显示文件标签名
        isShowLabelName     :   true,
        // 上传url
        uploadUrl           :   '/',
        // 列表尺寸
        listSize            :   {width: 100, height: 100},
        // 文件最大大小 (单位: KB)
        fileSize            :   1024 * 10,
        // 文件最大个数 (-1: 无限)
        fileLength          :   1,
        // 图片裁剪尺寸
        imageSize           :   {width: 0, height: 0},
        // 默认文件
        defaultFiles        :   [],
        // 是否可编辑
        editable            :   true,
        // 上传后是否加入上传列表 (false时将被无限个数;一般用于特殊演示类上传)
        isAddFileList       :   true,
        // 上传图标
        uploadIcon          :   <Icon type="plus" />
    }

    componentWillMount() {
        // 移动端
        if(browserAttr.versions.mobile)
        {
            this.imageSize = {width: this.props.imageSize.width / 2, height: this.props.imageSize.height / 2};
        }
        else
        {
            this.imageSize = {...this.props.imageSize}
        }

        this.className = 'component-Upload';
        // 不可编辑
        if(!this.props.editable)
        {
            this.className += ' component-Upload-readonly';
        }
        if(this.props.className)
        {
            this.className += ` ${this.props.className}`;
        }

        // 文件类型
        if(this.props.fileExt)
        {
            this.fileExt = this.props.fileExt.join(',');
        }
        else
        {
            switch(this.props.fileType)
            {
                // 图片
                case 'image':
                    this.fileExt = 'jpg,png,gif';
                    break;
                // 音乐
                case 'music':
                    this.fileExt = 'mp3,wav';
                    break;
                // 视频
                case 'video':
                    this.fileExt = 'mp4,avi,mov';
                    break;
                default:
                    this.fileExt = '*';
                    break;
            }
        }
        this.fileAccept = getFileAccepts(this.fileExt).join(',');

        // 初始文件列表
        if(this.props.initialFiles)
        {
            const filesUrl = this.props.initialFiles.url.split(',');
            const filesUrlDb = this.props.initialFiles.url_db.split(',');
            let fileList = [];
            filesUrl.map((v, k) => {
                fileList.push({url: v, url_db: filesUrlDb[k]});
            });
            this.setState({fileList});
        }
    }

    componentDidMount() {
        // 文件列表样式
        // 最大个数
        let length = Math.floor($(this.fileListUl).width() / (this.props.listSize.width + 2));
        // 最小边距15
        if(($(this.fileListUl).width() + 30 - this.props.listSize.width * length) / (length + 1) < 15)
        {
            length -= 1;
        }
        this.fileListStyle = {
            // 最大个数
            length,
            // 左边距
            marginLeft: ($(this.fileListUl).width() + 30 - this.props.listSize.width * length) / (length + 1)
        }
        // 刷新
        this.setState({});
    }

    // 选择文件
    selectFile = () => {
        const file = $(this.fileInput).get(0).files[0];
        if(!file)
        {
            this.fileInput.value = null;
            return;
        }

        // 验证格式
        if(this.fileAccept != '' && (this.fileAccept.indexOf(file.type) == -1 || file.type == ''))
        {
            Toast.info(<ToastContent type="fail" content={<div>请上传正确的{this.props.labelName}<br/>应是 {this.fileExt} 文件</div>} />, 5, null, false);
            this.fileInput.value = null;
            return;
        }

        // 验证大小（裁剪图片大小在裁剪后判断）
        if((this.imageSize.width <= 0 || this.imageSize.height <= 0) && file.size > this.props.fileSize * 1024)
        {
            Toast.info(<ToastContent type="fail" content={`${this.props.labelName}不能大于${this.props.fileSize}KB`} />, 5, null, false);
            this.fileInput.value = null;
            return;
        }

        // 图片裁剪
        if(isImageForAccept(file.type) && this.imageSize.width > 0 && this.imageSize.height > 0)
        {
            this.initImageCut(window.URL.createObjectURL(file), file);
        }
        else
        {
            // 上传
            const formData = new FormData();
            formData.append(this.props.fileName, file);
            formData.append(this.props.objName, this.props.obj);
            formData.append(this.props.fileTypeName, this.props.fileType);
            this.upload(formData);
        }
    }

    // 初始化图片裁剪区
    initImageCut = (src, file) => {
        // this.setState({isInitImageCut: true});
        let isLoad = false;
        this.cutImage.image = new Image();
        this.cutImage.image.onload = () => {
            isLoad = true;

            this.cutImage.width = browserAttr.versions.mobile ? this.cutImage.image.width / 2 : this.cutImage.image.width;
            this.cutImage.height = browserAttr.versions.mobile ? this.cutImage.image.height / 2 : this.cutImage.image.height;

            this.cutImageCanvasArea = (this.cutImage.width > this.cutImage.height ? this.cutImage.width : this.cutImage.height) * 2;

            // 裁剪内容宽度
            this.cutContentNum.width = document.body.clientWidth > 1000 ? this.cutImage.width > 1000 ? document.body.clientWidth : 1000 : document.body.clientWidth;

            // 裁剪内容高度
            this.cutContentNum.height = this.imageSize.height + (this.cutImage.height - this.imageSize.height > 150 ? 150 : this.cutImage.height - this.imageSize.height < 0 ? 0 : this.cutImage.height - this.imageSize.height);
            if(this.cutContentNum.height + 150 > document.body.clientHeight)
            {
                this.cutContentNum.height = document.body.clientHeight - 150;
            }

            const cutRegionNum = {
                marginTop: (this.cutContentNum.height - this.imageSize.height)/2,
                marginLeft: (this.cutContentNum.width - this.imageSize.width)/2
            }

            this.setState({
                // 图片参数
                cutImageNum: {
                    width: this.cutImage.width,
                    height: this.cutImage.height,
                    marginTop: (this.cutContentNum.height - this.cutImage.height)/2,
                    marginLeft: (this.cutContentNum.width - this.cutImage.width)/2,
                    scale: 1,
                    //---照片角度问题暂未解决---
                    rotate: 0,
                },
                // 裁剪区参数
                cutRegionNum,
                isCutImage: true,
                isInitImageCut: false
            });
            this.isRotateCutImage = true;
            this.isDrawCutImage = true;

            // 设置图片裁剪无效区参数
            this.setImageCutNone(cutRegionNum);

            // EXIF.getData(file, () => {
            //     // 顺时针旋转角度
            //     let rotate = 0;
            //     switch(EXIF.getTag(file, 'Orientation'))
            //     {
            //         case 3:
            //             rotate = 180;
            //             break;
            //         case 6:
            //             rotate = 90;
            //             break;
            //         case 8:
            //             rotate = 270;
            //             break;
            //     }
            //
            //     if(rotate == 90 || rotate == 270)
            //     {
            //         // const oldWidth = this.cutImage.width;
            //         // this.cutImage.width = this.cutImage.height;
            //         // this.cutImage.height = oldWidth;
            //     }
            //
            //
            // });
        }
        this.cutImage.image.src = src;

        //延迟判断图片载入
        setTimeout(() => {
            if(!isLoad)
            {
                Toast.info(<ToastContent type="fail" content={<div>请上传正确的{this.props.labelName}<br/>应是 {this.fileExt} 文件</div>} />, 5, null, false);
                this.fileInput.value = null;
                this.cutImage = {image: null, width: 0, height: 0};
                this.setState({isCutImage: false, isInitImageCut: false});
            }
        },5000);
    }

    // 绘制裁剪图片
    drawCutImage = () => {
        // 获取画布
        const context = this.cutImageCanvas.getContext('2d');
        // 清空画布
        context.clearRect(0, 0, this.cutImageCanvasArea, this.cutImageCanvasArea);
        // 绘制
        if(this.cutImage.image)
        {
            if(this.isRotateCutImage)
            {
                this.isRotateCutImage = false;
                context.rotate(this.state.cutImageNum.rotate * Math.PI / 180);
            }

            const width = this.state.cutImageNum.width * (browserAttr.versions.mobile ? 2 : 1) / this.state.cutImageNum.scale;
            const height = this.state.cutImageNum.height * (browserAttr.versions.mobile ? 2 : 1) / this.state.cutImageNum.scale;
            let x = 0, y =0;

            switch(this.state.cutImageNum.rotate)
            {
                case 90:
                    x = 0;
                    y = height * -1;
            }
            context.drawImage(
                this.cutImage.image,
                0,
                0,
                width,
                height,
                x,
                y,
                this.state.cutImageNum.width, this.state.cutImageNum.height
            );
        }
    }

    componentDidUpdate() {
        if(this.isDrawCutImage && this.cutImageCanvas)
        {
            this.drawCutImage();
            this.isDrawCutImage = false;
        }
    }

    // 设置图片裁剪无效区参数
    setImageCutNone = cutRegionNum => {
        this.setState({
            // 上
            cutNoneTopNum: {
                width: this.imageSize.width,
                height: cutRegionNum.marginTop,
                marginTop: 0,
                marginLeft: cutRegionNum.marginLeft
            },
            // 下
            cutNoneBottomNum: {
                width: this.imageSize.width,
                height: this.cutContentNum.height - cutRegionNum.marginTop - this.imageSize.height,
                marginTop: cutRegionNum.marginTop + this.imageSize.height,
                marginLeft: cutRegionNum.marginLeft
            },
            // 左
            cutNoneLeftNum: {
                width: cutRegionNum.marginLeft,
                height: this.cutContentNum.height,
                marginTop: 0,
                marginLeft: 0
            },
            // 右
            cutNoneRightNum: {
                width: this.cutContentNum.width - cutRegionNum.marginLeft - this.imageSize.width,
                height: this.cutContentNum.height,
                marginTop: 0,
                marginLeft: cutRegionNum.marginLeft + this.imageSize.width
            }
        });
    }

    // 图片裁剪开始拖动
    startImageCutMove = e => {
        //禁用拖动
        document.body.onselectstart = document.body.oncontextmenu = document.ondragstart = () => false;
        e.preventDefault();
        this.cutMoveCoordinate = {x: e.pageX || e.touches[0].clientX, y: e.pageY || e.touches[0].clientY};
    }

    // 图片裁剪结束拖动
    stopImageCutMove = e => {
        //释放拖动
        document.body.onselectstart = document.body.oncontextmenu = document.ondragstart = () => true;
        this.cutMoveCoordinate = null;
    }

    // 图片裁剪区域拖动
    imageCutRegionMove = e => {
        if(!this.cutMoveCoordinate)
        {
            return;
        }

        const x = e.pageX || e.touches[0].clientX;
        const y = e.pageY || e.touches[0].clientY;
        let cutRegionNum = {
            marginTop: this.state.cutRegionNum.marginTop + y - this.cutMoveCoordinate.y,
            marginLeft: this.state.cutRegionNum.marginLeft + x - this.cutMoveCoordinate.x
        }
        cutRegionNum = {
            marginTop: cutRegionNum.marginTop <= 0 ? 0 : cutRegionNum.marginTop >= this.cutContentNum.height - this.imageSize.height ? this.cutContentNum.height - this.imageSize.height : cutRegionNum.marginTop,
            marginLeft: cutRegionNum.marginLeft <= 0 ? 0 : cutRegionNum.marginLeft >= this.cutContentNum.width - this.imageSize.width ? this.cutContentNum.width - this.imageSize.width : cutRegionNum.marginLeft
        }

        this.setState({cutRegionNum});

        // 设置图片裁剪无效区参数
        this.setImageCutNone(cutRegionNum);

        this.cutMoveCoordinate = {x, y};
    }

    // 裁剪图片拖动
    imageCutMove = e => {
        if(!this.cutMoveCoordinate)
        {
            return;
        }

        const x = e.pageX || e.touches[0].clientX;
        const y = e.pageY || e.touches[0].clientY;

        this.setState({
            cutImageNum : {
                ...this.state.cutImageNum,
                marginTop: this.state.cutImageNum.marginTop + y - this.cutMoveCoordinate.y,
                marginLeft: this.state.cutImageNum.marginLeft + x - this.cutMoveCoordinate.x
            }
        });

        this.cutMoveCoordinate = {x, y};
    }

    // 裁剪图片缩放
    imageCutScale = scale => {
        const width = this.cutImage.width * scale;
        const height = this.cutImage.height * scale;

        this.setState({
            cutImageNum: {
                ...this.state.cutImageNum,
                width,
                height,
                marginTop: this.state.cutImageNum.marginTop - (height - this.state.cutImageNum.height) / 2,
                marginLeft: this.state.cutImageNum.marginLeft - (width - this.state.cutImageNum.width) / 2,
                scale
            }
        });
        this.isDrawCutImage = true;
    }

    // 裁剪图片缩放微调-缩小
    imageCutScaleMinus = () => {
        let scale = this.state.cutImageNum.scale - 0.01;
        this.imageCutScale(scale <= 0.1 ? 0.1 : scale);
    }

    // 裁剪图片缩放微调-放大
    imageCutScalePlus = () => {
        let scale = this.state.cutImageNum.scale + 0.01;
        this.imageCutScale(scale >= 1.9 ? 1.9 : scale);
    }

    // 取消裁剪图片
    imageCutCancel = () => {
        this.fileInput.value = null;
        this.setState({isCutImage: false});
        this.isDrawCutImage = true;
        this.cutImage = {image: null, width: 0, height: 0};
    }

    // 裁剪图片
    imageCutSubmit = () => {
        // 获取画布
        const context = this.uploadImageCanvas.getContext('2d');
        // 清空画布
        context.clearRect(0, 0, this.props.imageSize.width, this.props.imageSize.height);
        // 裁剪
        context.drawImage(
            this.cutImage.image,
            (this.state.cutRegionNum.marginLeft - this.state.cutImageNum.marginLeft) * (browserAttr.versions.mobile ? 2 : 1) / this.state.cutImageNum.scale,
            (this.state.cutRegionNum.marginTop - this.state.cutImageNum.marginTop) * (browserAttr.versions.mobile ? 2 : 1) / this.state.cutImageNum.scale,
            this.props.imageSize.width / this.state.cutImageNum.scale,
            this.props.imageSize.height / this.state.cutImageNum.scale,
            0,
            0,
            this.props.imageSize.width, this.props.imageSize.height
        );

        // 准备处理上传数据
        const formData = new FormData();
        const data = window.atob(this.uploadImageCanvas.toDataURL($(this.fileInput).get(0).files[0].type).split(',')[1]);
        const ua = new Uint8Array(data.length);
        for(let i=0; i<data.length; i++)
        {
            ua[i] = data.charCodeAt(i);
        }
        const blob = new Blob([ua], {type: $(this.fileInput).get(0).files[0].type});

        // 验证大小
        if(blob.size > this.props.fileSize * 1024)
        {
            Toast.info(<ToastContent type="fail" content={`${this.props.labelName}不能大于${this.props.fileSize}KB`} />, 5, null, false);
            this.imageCutCancel();
            return;
        }

        // 装入数据
        formData.append(this.props.fileName, blob);
        formData.append(this.props.objName, this.props.obj);
        formData.append(this.props.fileTypeName, this.props.fileType);

        this.imageCutCancel();
        // 上传
        this.upload(formData);
    }

    // 上传
    upload = formData => {
        $.ajax({
            type: 'POST',
            url: this.props.uploadUrl,
            data: formData,
            processData: false,
            dataType: 'json',
            contentType: false,
            xhrFields: {withCredentials : true},
            xhr: () =>
            {
                let xhr = $.ajaxSettings.xhr();
                if(xhr.upload)
                {
                    xhr.upload.addEventListener('progress' , evt => {
                        // 进度
                        this.setState({uploadingProgress: Math.floor(100 * evt.loaded / evt.total) || 0});
                    }, false);
                    return xhr;
                }
            },
            error: (XMLHttpRequest, textStatus, errorThrown) =>
            {
                try
                {
                    if(XMLHttpRequest.responseText)
                    {
                        Toast.info(<ToastContent type="fail" content={jQuery.parseJSON(XMLHttpRequest.responseText).data.message} />, 5, null, false);
                    }
                }
                catch(e)
                {
                    Toast.info(<ToastContent type="fail" content={XMLHttpRequest.responseText} />, 5, null, false);
                }
                this.setState({isUploading: false});
            },
            success: (data, textStatus, jqXHR) =>
            {
                this.setState({isUploading: false});
                this.addFile(data.data);
            }
        });

        this.setState({isUploading: true, uploadingProgress: 0});
    }

    /**
     * 新增已上传文件
     * file    {url, url_db}
     */
    addFile = file => {
        if(!this.props.isAddFileList) return;

        let fileList = this.state.fileList;
        fileList.push(file);
        this.setState({fileList});
        // 设置已上传文件值
        this.setVal(fileList);
    }

    // 删除已上传文件
    deleteFile = key => {
        ModalMobile.alert(`删除${this.props.labelName}`, `你确定删除该${this.props.labelName}吗？`, [
            {text: '否', onPress: null, style: 'default'},
            {text: '是', onPress: () => {
                let fileList = this.state.fileList;
                fileList.splice(key, 1);
                this.setState({fileList});
                // 设置已上传文件值
                this.setVal(fileList);
            }, style: {fontWeight: 'bold'}},
        ]);
    }

    // 设置已上传文件值
    setVal = fileList => {
        if(this.props.onChange)
        {
            let urlDb = [];
            fileList.map((v, k) => {
                urlDb.push(v.url_db);
            })
            this.props.onChange(urlDb.join(','));
        }
    }

    render()
    {
        // 已上传文件列表
        let fileList = [];
        const hasUpload = this.props.fileLength == -1 || this.state.fileList.length < this.props.fileLength;
        const fileListLength = this.state.fileList.length + (hasUpload ? 1 + this.props.defaultFiles.length : 0);
        const fileListMarginLeft = fileListLength < this.fileListStyle.length ? ($(this.fileListUl).width() + 30 - this.props.listSize.width * fileListLength) / (fileListLength + 1) : this.fileListStyle.marginLeft;
        const fileUrl = [];
        this.state.fileList.map((v, k) => {
            let fileBody = null;
            const fileNameArray = v.url_db.split('.');
            // 图片
            if(isImageForSuffix(fileNameArray[fileNameArray.length-1]))
            {
                fileUrl.push(getSrc(v.url));
                fileBody =
                    <div className="file-image-border" onClick={() => this.setState({previewImageNum : {isPreview : true, showIndex : k + 1}})}>
                        <img src={getSrc(v.url)} />
                    </div>
            }
            else
            {

            }

            fileList.push(
                <li key={k}
                    style={{
                        width: this.props.listSize.width,
                        height: this.props.listSize.height,
                        marginTop: k < this.fileListStyle.length ? 0 : 15,
                        marginLeft: k % this.fileListStyle.length == 0 ? fileListMarginLeft - 15 : fileListMarginLeft
                    }}>
                    {/*删除 (可编辑显示)*/}
                    {
                        this.props.editable
                            ?
                            <div className="file-remove-border" onClick={()=>this.deleteFile(k)} style={{marginLeft: this.props.listSize.width - 16}}>
                                <Icon type="times-circle" />
                            </div>
                            :
                            null
                    }
                    {fileBody}
                </li>
            );
        });

        // 上传文件
        let fileUpload = null;
        if(hasUpload && this.props.editable)
        {
            let fileUploadContent = null;
            if(this.state.isUploading)
            {
                // 进度
                fileUploadContent =
                    <div className="file-upload-progress-border">
                        <div className="file-upload-progress-content">
                            <Progress className="file-upload-progress" percent={this.state.uploadingProgress} position="normal" />
                            <div className="file-upload-progress-text">
                                {this.state.uploadingProgress}%
                            </div>
                        </div>
                    </div>
            }
            else if(this.state.isInitImageCut)
            {
                // loading
                fileUploadContent =
                    <div className="file-upload-init">
                        <span>正在解析</span>
                        <Icon className="fa-spin" type="spinner" />
                    </div>
            }
            else
            {
                // 上传
                fileUploadContent =
                    <div className="file-upload-button">
                        <input type="file" style={{width: this.props.listSize.width - 2, height: this.props.listSize.height - 2}} accept={this.fileAccept} ref={e=>this.fileInput=e} onChange={this.selectFile} />
                        <div className="file-upload-button-icon">{this.props.uploadIcon}</div>
                    </div>
            }

            fileUpload =
                <li className="file-upload"
                    key="upload"
                    style={{
                        width: this.props.listSize.width,
                        height: this.props.listSize.height,
                        marginTop: this.state.fileList.length < this.fileListStyle.length ? 0 : 15,
                        marginLeft: this.state.fileList.length % this.fileListStyle.length == 0 ? fileListMarginLeft - 15 : fileListMarginLeft
                    }}>
                    {fileUploadContent}
                </li>
        }

        // 默认文件
        let fileDefault = [];
        if(hasUpload && this.props.editable)
        {
            this.props.defaultFiles.map((v, k) => {
                fileDefault.push(
                    <li className="file-default"
                        key={`default_${k}`}
                        style={{
                            width: this.props.listSize.width,
                            height: this.props.listSize.height,
                            marginTop: this.state.fileList.length + k + 1 < this.fileListStyle.length ? 0 : 15,
                            marginLeft: (this.state.fileList.length + k + 1) % this.fileListStyle.length == 0 ? fileListMarginLeft - 15 : fileListMarginLeft
                        }}>
                        <div className="file-default-border"
                             style={{
                                 height: this.props.listSize.height - 27
                             }}>
                            <img src={getSrc(v)} onClick={e => this.previewFileForImage(e.target)} />
                        </div>
                        <div className="file-default-choose" onClick={()=>this.addFile({url: v, url_db: v})}>
                            选择此默认
                        </div>
                    </li>
                );
            });
        }

        return(
            <div className={this.className} style={this.props.style}>
                {/*标签名*/}
                {
                    this.props.isShowLabelName
                        ?
                        <div className="label-name">{this.props.labelName}</div>
                        :
                        null
                }
                {/*列表*/}
                <ul className="file-list" ref={e=>this.fileListUl=e}>
                    {/*<QueueAnim*/}
                        {/*type={['right', 'left']}*/}
                        {/*ease={['easeOutQuart', 'easeInOutQuart']}>*/}
                        {/*文件列表*/}
                        {fileList}
                        {/*上传文件*/}
                        {fileUpload}
                        {/*默认文件*/}
                        {fileDefault}
                    {/*</QueueAnim>*/}
                </ul>

                {/*图片裁剪*/}
                <Modal className="ant-modal-upload-image-cut" visible={this.state.isCutImage}>
                    <div className="cut-body" style={{width: this.cutContentNum.width}}>
                        <div className="cut-header">
                            <Icon className="cut-header-icon" type="scissors" />裁剪图片（{this.props.imageSize.width}*{this.props.imageSize.height}）
                        </div>
                        <div className="cut-content" style={{height: this.cutContentNum.height}}>
                            {/*裁剪区域*/}
                            <div className="cut-region"
                                 onMouseDown={this.startImageCutMove}
                                 onMouseUp={this.stopImageCutMove}
                                 onMouseMove={this.imageCutRegionMove}
                                 onTouchStart={this.startImageCutMove}
                                 onTouchEnd={this.stopImageCutMove}
                                 onTouchMove={this.imageCutRegionMove}
                                 style={{
                                     width: this.imageSize.width,
                                     height: this.imageSize.height,
                                     marginTop: this.state.cutRegionNum.marginTop,
                                     marginLeft: this.state.cutRegionNum.marginLeft
                                 }}>
                                <div className="cut-region-border1"></div>
                                <div className="cut-region-border2"></div>
                            </div>
                            {/*裁剪无效区-上*/}
                            <div className="cut-none cut-none-top"
                                 style={{
                                     width: this.state.cutNoneTopNum.width,
                                     height: this.state.cutNoneTopNum.height,
                                     marginTop: this.state.cutNoneTopNum.marginTop,
                                     marginLeft: this.state.cutNoneTopNum.marginLeft
                                 }}
                            />
                            {/*裁剪无效区-下*/}
                            <div className="cut-none cut-none-bottom"
                                 style={{
                                     width: this.state.cutNoneBottomNum.width,
                                     height: this.state.cutNoneBottomNum.height,
                                     marginTop: this.state.cutNoneBottomNum.marginTop,
                                     marginLeft: this.state.cutNoneBottomNum.marginLeft
                                 }}
                            />
                            {/*裁剪无效区-左*/}
                            <div className="cut-none cut-none-left"
                                 style={{
                                     width: this.state.cutNoneLeftNum.width,
                                     height: this.state.cutNoneLeftNum.height,
                                     marginTop: this.state.cutNoneLeftNum.marginTop,
                                     marginLeft: this.state.cutNoneLeftNum.marginLeft
                                 }}
                            />
                            {/*裁剪无效区-右*/}
                            <div className="cut-none cut-none-right"
                                 style={{
                                     width: this.state.cutNoneRightNum.width,
                                     height: this.state.cutNoneRightNum.height,
                                     marginTop: this.state.cutNoneRightNum.marginTop,
                                     marginLeft: this.state.cutNoneRightNum.marginLeft
                                 }}
                            />
                            {/*裁剪图片*/}
                            <canvas
                                className="cut-image-canvas"
                                ref={e=>this.cutImageCanvas=e}
                                onMouseDown={this.startImageCutMove}
                                onMouseUp={this.stopImageCutMove}
                                onMouseMove={this.imageCutMove}
                                onTouchStart={this.startImageCutMove}
                                onTouchEnd={this.stopImageCutMove}
                                onTouchMove={this.imageCutMove}
                                width={this.cutImageCanvasArea}
                                height={this.cutImageCanvasArea}
                                style={{
                                    marginTop: this.state.cutImageNum.marginTop,
                                    marginLeft: this.state.cutImageNum.marginLeft
                                }}
                            />
                            {/*上传图片*/}
                            <canvas
                                className="upload-image-canvas"
                                ref={e=>this.uploadImageCanvas=e}
                                width={this.props.imageSize.width}
                                height={this.props.imageSize.height}
                            />
                        </div>
                        <div className="cut-footer">
                            <div className="cut-slider-border">
                                <Icon className="cut-scale cut-scale-minus" type="search-minus" onClick={this.imageCutScaleMinus} />
                                <Slider className="cut-slider" value={this.state.cutImageNum.scale} min={0.1} max={1.9} step={0.01} onChange={this.imageCutScale} />
                                <Icon className="cut-scale cut-scale-plus" type="search-plus" onClick={this.imageCutScalePlus} />
                            </div>
                            <div className="cut-button">
                                <Button className="cut-button-cancel" onClick={this.imageCutCancel}>取消</Button>
                                <Button className="cut-button-ok" type="primary" onClick={this.imageCutSubmit}>确定</Button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/*图片预览*/}
                <ImageShow
                    url={fileUrl}
                    isShow={this.state.previewImageNum.isPreview}
                    page={this.state.previewImageNum.showIndex}
                    prev={page => this.setState({previewImageNum : {...this.state.previewImageNum, showIndex : page - 1}})}
                    next={page => this.setState({previewImageNum : {...this.state.previewImageNum, showIndex : page + 1}})}
                    onClick={() => this.setState({previewImageNum : {...this.state.previewImageNum, isPreview : false}})}
                />
            </div>
        )
    }
}

export default Upload;