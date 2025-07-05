// components/DraggableRichText.tsx
import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

export default function DraggableRichText({ x = 100, y = 100, width = 300, height = 200, content, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content || '<p>Hello <strong>world!</strong></p>',
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  useEffect(() => {
    return () => editor?.destroy(); // clean up on unmount
  }, []);

  return (
    <Rnd
      default={{ x, y, width, height }}
      bounds="parent"
      style={{ border: '1px solid #ccc', background: '#fff' }}
    >
      <div style={{ padding: 10, height: '100%', overflow: 'auto' }}>
        {editor && (
          <>
            <div style={{ borderBottom: '1px solid #ddd', marginBottom: 8 }}>
              <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
              <button onClick={() => {
                const url = prompt('Image URL');
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}>Insert Image</button>
            </div>
            <EditorContent editor={editor} />
          </>
        )}
      </div>
    </Rnd>
  );
}
