import React from 'react'
import PropTypes from 'prop-types'
import {message, Upload} from 'antd'
import ReactMde, {commands, MarkdownUtil} from 'react-mde'
import Showdown from 'showdown'
import xss from 'xss'
import 'react-mde/lib/styles/css/react-mde-all.css'
import {CloudUploadOutlined} from '@ant-design/icons';

const DRAFT_CACHE = 'CACHE_MD_EDITOR_DRAFT';
const DRAFT_STEP = 10;

// 国际化【替换文案】
const L18N = {
    write: '输入',
    preview: '预览',
};

const xssFilter = () => [
    {
        type: 'output',
        filter(text) {
            return xss(text)
        },
    },
];

// markdown 转换器
const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    openLinksInNewWindow: true,
    smoothLivePreview: true,
    emoji: true,
    parseImgDimensions: true,
    extensions: [xssFilter],
});

// 编辑器state,api
let editorState = {};
let editorApi = {};

// 自定义编辑指令
const diyCommands = [{
    commands: Object.values({
        ...commands,
        // 重写图片指令
        imageCommand: {
            name: 'image',
            buttonProps: {
                'aria-label': 'Add image',
            },
            execute: (state, api) => {
                // 将编辑器state,api存起来，上传图片之后继续操作
                editorState = state
                editorApi = api
            },
            keyCommand: 'image',
        },
    }),
}];

// markdwon 转 html
export const markdownToHtml = markdown => (typeof markdown === 'string'
        ? converter.makeHtml(markdown)
        : markdown
);

export const markdownToText = (markdown, imgStr = '[图片]') => (typeof markdown);

// export const markdownToText = (markdown, imgStr = '[图片]') => (typeof markdown === 'string'
//         ? removeHtmlTagOfStr(markdownToHtml(markdown).replace(/(<img.+>)/g, imgStr))
//         : markdown
// );

// 预览
export const Review = ({markdown, contentStyle}) => (
    <div className="mde-preview">
        <p
            className="mde-preview-content"
            style={contentStyle}
            dangerouslySetInnerHTML={{__html: markdownToHtml(markdown)}}
        />
    </div>
);

Review.defaultProps = {
    markdown: '',
    contentStyle: {},
};

Review.propTypes = {
    contentStyle: PropTypes.object,
    markdown: PropTypes.string,
};

export default class Editor extends React.Component {
    static defaultProps = {
        onChange: () => {
        },
        cacheId: '1',
    };

    static propTypes = {
        onChange: PropTypes.func,
        cacheId: PropTypes.string,
    };

    state = {
        value: '',
        selectedTab: 'write',
        loading: false,
        draftIndex: -1,
    };

    setImageToEditor = (filePath, fileName) => {
        try {
            // Select everything
            const newSelectionRange = MarkdownUtil.selectWord({
                text: editorState.text,
                selection: editorState.selection,
            });
            const newState = editorApi.setSelectionRange(newSelectionRange);
            // Replaces the current selection with the image
            const imageName = newState.selectedText || fileName || '';
            const imageUrl = filePath ? encodeURI(filePath) : '';
            editorApi.replaceSelection(`![${imageName}](${imageUrl})`);
            // Adjust the selection to not contain the **
            editorApi.setSelectionRange({
                start: 4 + newState.selection.start + imageName.length,
                end: 4 + newState.selection.start + imageName.length + imageUrl.length,
            })
        } catch (e) {
            console.error(e);
            message.error('图片上传失败，请刷新页面后重试！');
            this.setState({loading: false});
        }
    };

    getUpload = (loading = this.state.loading) => (loading ? <CloudUploadOutlined/> : (
        <Upload
            name="files"
            action="/api/upload"
            accept="image/*"
            showUploadList={false}
            customRequest={({action, file}) => {
                const form = new FormData();
                form.set('files', file);
                this.setState({loading: true});
                // getJSON(action, form).then(([{filePath, fileName} = {}] = []) => {
                //     this.setImageToEditor(filePath, fileName)
                //     this.setState({loading: false})
                // }).catch(e => {
                //     this.setState({loading: false})
                //     message.error(e)
                // })
            }}
            multiple={false}
        >
            {/*<SvgIcon icon="image"/>*/}
        </Upload>
    ));

    setDraft = val => {
        const {cacheId} = this.props;
        const {hash} = window.location;
        const draft = this.getDraft();
        return localStorage.setItem(`${DRAFT_CACHE}${hash}__${cacheId}`, JSON.stringify([val, ...draft].splice(0, DRAFT_STEP)))
    };

    getDraft = () => {
        const {cacheId} = this.props
        const {hash} = window.location
        return JSON.parse(localStorage.getItem(`${DRAFT_CACHE}${hash}__${cacheId}`)) || []
    };

    // 重新渲染“image”图标
    // getIcon = commandName => (commandName === 'image' ? this.getUpload() : <SvgIcon icon={commandName}/>)

    handleChange = value => {
        const {onChange = val => val} = this.props;
        onChange(value);
        this.setDraft(value);
        this.setState({value, draftIndex: 0})
    };

    draftStepTo = step => {
        const {draftIndex} = this.state;
        const {onChange = val => val} = this.props;
        const newDraftIndex = draftIndex + step;
        const draft = this.getDraft();
        const value = draft[newDraftIndex];
        onChange(value);
        this.setState({value, draftIndex: newDraftIndex})
    };

    render() {
        const {selectedTab, value, draftIndex} = this.state;
        const draft = this.getDraft() || [];
        const draftMaxIndex = draft.length - 1;
        return (
            <div>
                <div>
                    {/*<Icon*/}
                    {/*    type="enter"*/}
                    {/*    onClick={() => this.draftStepTo(1)}*/}
                    {/*    style={{visibility: draftIndex < draftMaxIndex ? 'visible' : 'hidden'}}*/}
                    {/*/>*/}
                    {/*<Icon*/}
                    {/*    type="enter"*/}
                    {/*    onClick={() => this.draftStepTo(-1)}*/}
                    {/*    style={{visibility: draftIndex > 0 ? 'visible' : 'hidden'}}*/}
                    {/*/>*/}
                </div>
                <ReactMde
                    selectedTab={selectedTab}
                    onTabChange={val => this.setState({selectedTab: val})}
                    generateMarkdownPreview={
                        markdown => Promise.resolve(markdownToHtml(markdown || ''))
                    }
                    commands={diyCommands}
                    minEditorHeight={180}
                    minPreviewHeight={100}
                    l18n={L18N}
                    value={value}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}
