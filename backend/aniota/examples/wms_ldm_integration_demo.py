

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("wms_ldm_integration_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

LDM Integration Demo
Demonstrates the integration between WMS and LDM for memory consolidation and retrieval.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import time
from datetime import datetime, timedelta
from backend.core.caf import CognitiveFramework
from backend.memory.wms import WorkingMemorySystem
from backend.memory.ldm import LongTermDeclarativeMemory

def demo_wms_ldm_integration():
    """Demonstrate the integration between WMS and LDM"""
    
    print("=== WMS-LDM Integration Demo ===\n")
    
    # Initialize the system hierarchy
    print("1. Initializing system components...")
    caf = CognitiveFramework()
    caf.initialize()
    
    wms = WorkingMemorySystem(parent_caf=caf)
    wms.initialize()
    
    ldm = LongTermDeclarativeMemory(parent_wms=wms)
    ldm.initialize()
    
    # Register modules with CAF
    caf.register_module(wms)
    caf.register_module(ldm)
    
    # Set up hierarchy
    wms.add_child(ldm)
    
    print("✓ System components initialized\n")
    
    # Store some memories in WMS
    print("2. Storing memories in WMS...")
    
    memories = [
        {
            'id': 'memory_001',
            'content': {
                'type': 'learning_experience',
                'subject': 'Python programming',
                'details': 'Learned about list comprehensions and their efficiency benefits',
                'context': 'coding_session',
                'importance': 'high'
            },
            'type': 'semantic'
        },
        {
            'id': 'memory_002',
            'content': {
                'type': 'problem_solving',
                'subject': 'debugging',
                'details': 'Successfully debugged a memory leak by profiling with memory_profiler',
                'context': 'development_task',
                'importance': 'medium'
            },
            'type': 'procedural'
        },
        {
            'id': 'memory_003',
            'content': {
                'type': 'insight',
                'subject': 'architecture_pattern',
                'details': 'Realized that modular design allows for better testability and maintenance',
                'context': 'system_design',
                'importance': 'high'
            },
            'type': 'semantic'
        }
    ]
    
    for memory in memories:
        success = wms.store_memory(memory['id'], memory['content'], memory['type'])
        print(f"✓ Stored {memory['id']}: {memory['content']['subject']}")
    
    print(f"\nWMS Status: {wms.get_memory_status()['active_memories']} active memories\n")
    
    # Simulate memory access and strengthening
    print("3. Simulating memory access patterns...")
    
    # Access some memories multiple times to strengthen them
    for i in range(3):
        retrieved = wms.retrieve_memory('memory_001')
        if retrieved:
            print(f"✓ Accessed memory_001 (attempt {i+1})")
    
    for i in range(2):
        retrieved = wms.retrieve_memory('memory_003')
        if retrieved:
            print(f"✓ Accessed memory_003 (attempt {i+1})")
    
    print()
    
    # Update consolidation scores to trigger consolidation
    print("4. Updating memory consolidation scores...")
    
    for memory_id in ['memory_001', 'memory_002', 'memory_003']:
        # Simulate high consolidation scores
        wms.active_memories[memory_id]['consolidation_score'] = 0.9
        print(f"✓ Set high consolidation score for {memory_id}")
    
    print()
    
    # Process decay cycle to trigger consolidation
    print("5. Processing decay cycle to trigger consolidation...")
    
    # Force the decay cycle by adjusting the last decay time
    wms.last_decay_cycle = datetime.now() - timedelta(seconds=wms.decay_interval + 1)
    
    decay_stats = wms.process_decay_cycle()
    print(f"Decay cycle results: {decay_stats}")
    
    # Check LDM status
    ldm_stats = ldm.get_memory_statistics()
    print(f"LDM Status: {ldm_stats['active_memories']} active memories")
    print()
    
    # Demonstrate LDM retrieval
    print("6. Retrieving memories from LDM...")
    
    for memory_id in ['memory_001', 'memory_002', 'memory_003']:
        retrieved = ldm.retrieve_memory(memory_id)
        if retrieved:
            print(f"✓ Retrieved {memory_id} from LDM: {retrieved.get('subject', 'N/A')}")
        else:
            print(f"✗ Failed to retrieve {memory_id} from LDM")
    
    print()
    
    # Demonstrate LDM search capabilities
    print("7. Demonstrating LDM search capabilities...")
    
    search_queries = ['Python', 'debugging', 'architecture']
    
    for query in search_queries:
        results = ldm.search_memories(query, max_results=5)
        print(f"Search for '{query}': {len(results)} results")
        for memory_id, content, score in results:
            print(f"  - {memory_id}: {content.get('subject', 'N/A')} (score: {score:.3f})")
        print()
    
    # Demonstrate cluster retrieval
    print("8. Demonstrating cluster-based retrieval...")
    
    cluster_results = ldm.get_memories_by_cluster('general', max_results=10)
    print(f"Cluster 'general': {len(cluster_results)} memories")
    for memory_id, content in cluster_results:
        print(f"  - {memory_id}: {content.get('subject', 'N/A')}")
    
    print()
    
    # Show comprehensive statistics
    print("9. System statistics:")
    print("WMS Statistics:")
    wms_stats = wms.get_memory_status()
    for key, value in wms_stats.items():
        if key != 'last_decay_cycle':
            print(f"  {key}: {value}")
    
    print("\nLDM Statistics:")
    ldm_stats = ldm.get_memory_statistics()
    for key, value in ldm_stats.items():
        if key not in ['last_fade_cycle', 'access_pattern_summary']:
            print(f"  {key}: {value}")
    
    print("\nAccess Pattern Summary:")
    access_summary = ldm_stats.get('access_pattern_summary', {})
    for key, value in access_summary.items():
        print(f"  {key}: {value}")
    
    # Demonstrate fade cycle
    print("\n10. Demonstrating LDM fade cycle...")
    
    # Simulate time passage by manually adjusting timestamps
    print("Simulating time passage...")
    for memory_id, memory in ldm.long_term_memories.items():
        # Move last access time back by 48 hours
        memory['last_access_time'] = datetime.now() - timedelta(hours=48)
    
    fade_stats = ldm.process_fade_cycle()
    print(f"Fade cycle results: {fade_stats}")
    
    final_ldm_stats = ldm.get_memory_statistics()
    print(f"Final LDM active memories: {final_ldm_stats['active_memories']}")
    print(f"Final LDM cold storage: {final_ldm_stats['cold_storage_memories']}")
    
    print("\n=== Demo Complete ===")

if __name__ == "__main__":
    demo_wms_ldm_integration()
