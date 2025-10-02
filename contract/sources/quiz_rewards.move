module message_board_addr::quiz_rewards {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    // Event emitted when a quiz is completed with full marks
    #[event]
    struct QuizCompletionEvent has drop, store {
        user_address: address,
        quiz_name: String,
        score: u64,
        completion_time: u64,
        certificate_id: String,
    }

    // Struct to store quiz completion records
    struct QuizCompletion has key {
        completions: vector<CompletionRecord>,
        total_completed: u64,
    }

    struct CompletionRecord has store, drop, copy {
        quiz_name: String,
        score: u64,
        completion_time: u64,
        certificate_id: String,
    }

    // Error codes
    const E_INVALID_SCORE: u64 = 3;

    // Record quiz completion and emit event
    public entry fun complete_quiz_with_reward(
        user: &signer,
        quiz_name: String,
        score: u64,
        max_score: u64,
        certificate_id: String,
    ) acquires QuizCompletion {
        // Verify perfect score (100%)
        assert!(score == max_score && score > 0, E_INVALID_SCORE);
        
        let user_addr = signer::address_of(user);
        
        // Initialize user's quiz completion record if it doesn't exist
        if (!exists<QuizCompletion>(user_addr)) {
            move_to(user, QuizCompletion {
                completions: vector::empty<CompletionRecord>(),
                total_completed: 0,
            });
        };
        
        // Add completion record
        let user_completions = borrow_global_mut<QuizCompletion>(user_addr);
        let completion_record = CompletionRecord {
            quiz_name,
            score,
            completion_time: timestamp::now_seconds(),
            certificate_id,
        };
        vector::push_back(&mut user_completions.completions, completion_record);
        user_completions.total_completed = user_completions.total_completed + 1;
        
        // Emit completion event
        event::emit(QuizCompletionEvent {
            user_address: user_addr,
            quiz_name,
            score,
            completion_time: timestamp::now_seconds(),
            certificate_id,
        });
    }

    // View function to get user's quiz completions
    #[view]
    public fun get_user_completions(user_addr: address): vector<CompletionRecord> acquires QuizCompletion {
        if (!exists<QuizCompletion>(user_addr)) {
            return vector::empty<CompletionRecord>()
        };
        let user_completions = borrow_global<QuizCompletion>(user_addr);
        user_completions.completions
    }

    // View function to get total completions count
    #[view]
    public fun get_total_completions(user_addr: address): u64 acquires QuizCompletion {
        if (!exists<QuizCompletion>(user_addr)) {
            return 0
        };
        let user_completions = borrow_global<QuizCompletion>(user_addr);
        user_completions.total_completed
    }

    #[test_only]
    public fun init_module_for_test() {
        // No initialization needed for this simplified version
    }
}
