// pages/TemplateBuilder.tsx
import React, { useState } from 'react';
import DraggableRichText from '@/components/DraggableRichText';

export default function TemplateBuilder() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '<p>New text</p>' : '',
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const updateContent = (id, html) => {
    setBlocks(prev =>
      prev.map(block => (block.id === id ? { ...block, content: html } : block))
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Toolbox */}
      <div style={{ width: 200, borderRight: '1px solid #ccc', padding: 10 }}>
        <h4>Toolbox</h4>
        <button onClick={() => addBlock('text')}>🅰 Text</button>
        <button onClick={() => addBlock('image')}>🖼 Image</button>
        <button onClick={() => addBlock('signature')}>✍ Signature</button>
        <button onClick={() => addBlock('placeholder')}>🧩 Placeholder</button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', background: '#f7f7f7', padding: 10 }}>
        {blocks.map(block => {
          if (block.type === 'text') {
            return (
              <DraggableRichText
                key={block.id}
                content={block.content}
                onUpdate={(html) => updateContent(block.id, html)}
              />
            );
          }

          if (block.type === 'image') {
            return (
              <div key={block.id} style={{ position: 'absolute', left: 100, top: 100 }}>
                <img src="/placeholder.png" alt="Image" width={150} />
              </div>
            );
          }

          if (block.type === 'signature') {
            return (
              <div key={block.id} style={{ position: 'absolute', left: 100, top: 100, border: '1px dashed #444', width: 200, height: 80, padding: 8 }}>
                <i>Signature Area</i>
              </div>
            );
          }

          if (block.type === 'placeholder') {
            return (
              <div key={block.id} style={{ position: 'absolute', left: 100, top: 100, padding: 4, border: '1px dotted #888' }}>
                {"{clientName}"}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
