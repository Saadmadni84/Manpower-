import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start typing...',
  maxLength = null,
  minHeight = '200px',
  showCharCount = true,
  toolbar = 'full'
}) => {
  const [charCount, setCharCount] = useState(0);
  const quillRef = useRef(null);

  const toolbarOptions = {
    minimal: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link']
    ],
    basic: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    full: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const modules = {
    toolbar: toolbarOptions[toolbar] || toolbarOptions.full
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const handleChange = (content, delta, source, editor) => {
    const text = editor.getText();
    const count = text.trim().length;
    setCharCount(count);

    if (maxLength && count > maxLength) {
      return; // Don't allow more characters
    }

    onChange(content);
  };

  const isNearLimit = maxLength && charCount > maxLength * 0.9;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ minHeight }}
      />
      
      {showCharCount && (
        <div className={`char-count ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}>
          {charCount}
          {maxLength && ` / ${maxLength}`} characters
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
