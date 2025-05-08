import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useDesignStore = create(
  persist(
    (set, get) => ({
      designs: [],
      activeDesign: null,
      roomSettings: {
        width: 10,
        length: 10,
        height: 3,
        wallColor: '#ffffff',
        floorColor: '#f0f0f0'
      },
      furniture: [],
      roomTemplates: {
        livingRoom: {
          name: 'Living Room',
          width: 6,
          length: 8,
          height: 3,
          wallColor: '#f5f5f5',
          floorColor: '#e0e0e0',
          suggestedFurniture: ['sofa', 'coffeeTable', 'sideTable', 'armchair']
        },
        diningRoom: {
          name: 'Dining Room',
          width: 5,
          length: 7,
          height: 3,
          wallColor: '#f0f0f0',
          floorColor: '#d9d9d9',
          suggestedFurniture: ['diningTable', 'diningChair', 'sideboard']
        },
        bedroom: {
          name: 'Bedroom',
          width: 4,
          length: 6,
          height: 3,
          wallColor: '#f8f8f8',
          floorColor: '#e8e8e8',
          suggestedFurniture: ['bed', 'nightstand', 'wardrobe', 'dresser']
        },
        office: {
          name: 'Home Office',
          width: 4,
          length: 4,
          height: 3,
          wallColor: '#f5f5f5',
          floorColor: '#e5e5e5',
          suggestedFurniture: ['desk', 'officeChair', 'bookshelf']
        }
      },
      selectedTemplate: null,

      setRoomSettings: (settings) => set({
        roomSettings: settings
      }),

      addFurniture: (item) => set((state) => ({
        furniture: [...state.furniture, { 
          ...item, 
          color: item.color || '#ffffff',
          materials: item.materials || {
            roughness: 0.7,
            metalness: 0.3,
            opacity: 1
          },
          id: Date.now()
        }]
      })),

      updateFurniture: (id, updates) => set((state) => ({
        furniture: state.furniture.map(item =>
          item.id === id 
            ? { 
                ...item, 
                ...updates,
                color: updates.color ? updates.color.toLowerCase() : item.color,
                materials: updates.materials ? {
                  ...item.materials,
                  ...updates.materials
                } : item.materials
              } 
            : item
        )
      })),

      removeFurniture: (id) => set((state) => ({
        furniture: state.furniture.filter(item => item.id !== id)
      })),

      saveDesign: (design) => set((state) => ({
        designs: [...state.designs, {
          ...design,
          id: Date.now(),
          timestamp: Date.now(),
          roomSettings: { ...design.roomSettings },
          furniture: design.furniture.map(item => ({ ...item }))
        }]
      })),

      loadDesign: (id) => set((state) => {
        const design = state.designs.find(d => d.id === id)
        if (design) {
          return {
            activeDesign: design,
            roomSettings: { ...design.roomSettings },
            furniture: design.furniture.map(item => ({ ...item }))
          }
        }
        return state
      }),

      clearDesigns: () => set({ 
        designs: [],
        activeDesign: null
      }),

      duplicateDesign: (id) => set((state) => {
        const design = state.designs.find(d => d.id === id)
        if (design) {
          return {
            designs: [...state.designs, {
              ...design,
              id: Date.now(),
              name: `${design.name} (Copy)`,
              timestamp: Date.now()
            }]
          }
        }
        return state
      }),

      updateDesign: (id, updates) => set((state) => ({
        designs: state.designs.map(design =>
          design.id === id ? { ...design, ...updates } : design
        )
      })),

      addDesignMetadata: (id, metadata) => set((state) => ({
        designs: state.designs.map(design =>
          design.id === id ? { 
            ...design, 
            metadata: { ...design.metadata, ...metadata },
            lastModified: Date.now()
          } : design
        )
      })),

      editDesign: (id, updates) => set((state) => ({
        designs: state.designs.map(design =>
          design.id === id ? { ...design, ...updates } : design
        )
      })),

      deleteDesign: (id) => set((state) => ({
        designs: state.designs.filter(design => design.id !== id)
      })),

      clearCurrentDesign: () => set({
        activeDesign: null,
        roomSettings: {
          width: 10,
          length: 10,
          height: 3,
          wallColor: '#ffffff',
          floorColor: '#f0f0f0'
        },
        furniture: []
      }),

      resetDesign: () => set({
        activeDesign: null,
        roomSettings: {
          width: 10,
          length: 10,
          height: 3,
          wallColor: '#ffffff',
          floorColor: '#f0f0f0'
        },
        furniture: []
      }),

      setActiveDesign: (design) => set({
        activeDesign: design,
        roomSettings: design.roomSettings,
        furniture: design.furniture
      }),

      setRoomTemplate: (templateKey) => set((state) => ({
        selectedTemplate: templateKey,
        roomSettings: { ...state.roomTemplates[templateKey] }
      })),

      updateRoomTemplate: (template) => set((state) => {
        const updatedTemplates = { ...state.roomTemplates }
        
        if (template.id) {
          // Update existing template
          updatedTemplates[template.id] = {
            name: template.name,
            width: template.width,
            length: template.length,
            height: template.height,
            wallColor: template.wallColor || '#f5f5f5',
            floorColor: template.floorColor || '#e0e0e0',
            suggestedFurniture: template.suggestedFurniture || []
          }
        } else {
          // Create new template with generated ID
          const newId = `template_${Date.now()}`
          updatedTemplates[newId] = {
            name: template.name,
            width: template.width || 4,
            length: template.length || 4,
            height: template.height || 3,
            wallColor: template.wallColor || '#f5f5f5',
            floorColor: template.floorColor || '#e0e0e0',
            suggestedFurniture: template.suggestedFurniture || []
          }
        }

        return { roomTemplates: updatedTemplates }
      }),

      deleteRoomTemplate: (templateId) => set((state) => {
        const updatedTemplates = { ...state.roomTemplates }
        delete updatedTemplates[templateId]
        return { roomTemplates: updatedTemplates }
      })
    }),
    {
      name: 'furniture-design-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        roomSettings: {
          ...currentState.roomSettings,
          ...persistedState.roomSettings,
          wallColor: persistedState.roomSettings?.wallColor?.toLowerCase() || currentState.roomSettings.wallColor,
          floorColor: persistedState.roomSettings?.floorColor?.toLowerCase() || currentState.roomSettings.floorColor
        },
        furniture: (persistedState.furniture || []).map(item => ({
          ...item,
          color: item.color?.toLowerCase() || '#ffffff'
        }))
      })
    }
  )
) 