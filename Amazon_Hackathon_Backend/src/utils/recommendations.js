// const vendors = [
//     {
//       id: 1,
//       name: 'Tech Solutions Inc',
//       category: 'IT Services',
//       specialties: ['web development', 'cloud computing', 'cybersecurity'],
//       region: 'North America'
//     },
//     {
//       id: 2,
//       name: 'Digital Innovations',
//       category: 'Software Development',
//       specialties: ['mobile apps', 'AI solutions', 'web development'],
//       region: 'Europe'
//     },
//     {
//       id: 3,
//       name: 'Cloud Masters',
//       category: 'Cloud Services',
//       specialties: ['cloud computing', 'infrastructure', 'migration'],
//       region: 'Asia'
//     },
//     {
//       id: 4,
//       name: 'Security Experts',
//       category: 'Cybersecurity',
//       specialties: ['cybersecurity', 'network protection', 'threat analysis'],
//       region: 'Global'
//     }
//   ];
  
//   class VendorRecommendationEngine {
//     // Generate recommendations based on selected vendor IDs
//     generateRecommendations(selectedVendorIds) {
//       if (!selectedVendorIds || selectedVendorIds.length === 0) {
//         return [];
//       }
  
//       // Find selected vendors
//       const selectedVendors = vendors.filter(v => 
//         selectedVendorIds.includes(v.id)
//       );
  
//       // Collect common specialties and categories
//       const commonSpecialties = selectedVendors.flatMap(v => v.specialties);
//       const commonCategories = selectedVendors.map(v => v.category);
  
//       // Find similar vendors
//       const recommendations = vendors.filter(vendor => 
//         // Exclude already selected vendors
//         !selectedVendorIds.includes(vendor.id) && 
//         // Match at least one specialty or category
//         (vendor.specialties.some(spec => commonSpecialties.includes(spec)) ||
//          commonCategories.includes(vendor.category))
//       );
  
//       return recommendations;
//     }
  
//     // Get vendor details by ID
//     getVendorDetails(vendorId) {
//       return vendors.find(v => v.id === vendorId);
//     }
  
//     // List all available vendors
//     getAllVendors() {
//       return vendors;
//     }
//   }
  
//   module.exports = new VendorRecommendationEngine();