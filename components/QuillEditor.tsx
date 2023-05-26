import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }: any) => {
  const [insertImageSource, setInsertImageSource] = useState(false);
  const quillRef = useRef<any>(null); // Create a ref for the Quill Editor component
  const handleImageInsert = () => {
    setInsertImageSource(true);
  };
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link'],
        ['image'],
        ['clean'],
      ],
      handlers: {
        image: handleImageInsert,
      },
    },
  };

  const formats = ['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'indent', 'align', 'link', 'image'];

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result;
        const range = quillRef.current.getEditor().getSelection(true);
        quillRef.current.getEditor().insertEmbed(range.index, 'image', imageDataUrl);
        quillRef.current.getEditor().setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    }
    setInsertImageSource(false);
  };

  return (
    <>
      {insertImageSource ? (
        <div>
          <input type='text' placeholder='Enter image URL' />
          <button onClick={() => setInsertImageSource(false)}>Insert</button>
          <input type='file' accept='image/*' onChange={handleImageUpload} />
        </div>
      ) : (
        <ReactQuill
          ref={quillRef} // Attach the ref to the Quill Editor component
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
        />
      )}
    </>
  );
};

export default QuillEditor;
